import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { statusValidation } from "@/lib/utils/features";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, props: { params: Promise<{ orderId: String }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const order = await Order.findById(params.orderId).select('_id status createdAt');

    if (!order) return new NextResponse("Order not found", {
      status: 404,
    });
    const orderCreationTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - orderCreationTime) / (1000 * 60 * 60);

    if (order.status==="canceled") {
      return NextResponse.json(
        "Order is already canceled",
        { status: 409, statusText: "Order is already canceled" } // Conflict
      );
    }

    if (timeDifference >= 2) {
      return NextResponse.json(
        "Cancelling order is only allowed within 2 hours after it's placed",
        { status: 403, statusText: "Cancelling order is only allowed within 2 hours after it's placed" } // Forbidden
      );
    }

    const { status } = await req.json();

    if (order.status) {
      order.status = statusValidation(status);
      if (!order.statusHistory) {
        order.statusHistory = [];
      }
      order.statusHistory.push({
        status: status,
        changedAt: Date.now()
      });
    }
    await order.save();
    revalidatePath('/orders')
    return NextResponse.json("Order Canceled Successfully", { status: 200 })
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });

  }
};


export const dynamic = "force-dynamic";