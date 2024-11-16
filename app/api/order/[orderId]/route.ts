import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { orderId: String } }) => {
  try {
    await connectToDB();

    const order = await Order.findById(params.orderId);

    if (!order) return new NextResponse("Order not found", {
      status: 404,
    });

    const { status } = await req.json();

    if (order.status) {
      order.status = status;
    }
    await order.save();
    revalidatePath('/orders')
    return NextResponse.json("Order Canceled Successfully", { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    } else {
      return new NextResponse('An unknown error occurred', { status: 500 });
    }
  }
};


export const dynamic = "force-dynamic";