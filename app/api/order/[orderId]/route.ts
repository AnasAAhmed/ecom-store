import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { orderId: String } }) => {
  try {
    await connectToDB();

    const order = await Order.findById(params.orderId).select('_id status createdAt');

    if (!order) return new NextResponse("Order not found", {
      status: 404,
    });
    const orderCreationTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - orderCreationTime) / (1000 * 60 * 60);

    if (order.status.startsWith("Canceled")) {
      return NextResponse.json(
        { message: "Order is already canceled" },
        { status: 409 } // Conflict
      );
    }

    if (timeDifference >= 2) {
      return NextResponse.json(
        { message: "Cancelling order is only allowed within 2 hours after it's placed" },
        { status: 403 } // Forbidden
      );
    }

    const { status } = await req.json();

    if (order.status) {
      order.status = status;
    }
    await order.save();
    revalidatePath('/orders')
    return NextResponse.json("Order Canceled Successfully", { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });

  }
};


export const dynamic = "force-dynamic";