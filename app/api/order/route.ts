import { stockReduce } from "@/lib/actions/order.actions";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const body = await req.json();
    const {
      orderData, customerInfo
    } = body;

    const {
      customerPhone,
      shippingAddress,
      products,
      totalAmount,
      exchangeRate,
      shippingRate,
      currency,
    } = orderData;

    if (!shippingAddress || !products || !shippingRate || !totalAmount || !currency) {
      return NextResponse.json(`Please enter All Details` , { status: 400 });
    }
    if (!customerInfo.id || !customerInfo.email) {
      return NextResponse.json('User Details Missing/Login first', { status: 400 });
    }

    await stockReduce(products);

    const newOrder = new Order({
      customerPhone,
      shippingAddress,
      products,
      totalAmount: totalAmount / exchangeRate,
      shippingRate,
      customerEmail: customerInfo.email,
      currency,
      isPaid:false,
      statusHistory: { status: "Payment-Successfull & Processing", changedAt: Date.now() },
      status: 'pending',
      method: 'COD',
      exchangeRate
    });
    await newOrder.save();
    let customer = await Customer.findById(customerInfo.id)

    if (customer) {
      customer.orders.push(newOrder._id);
      customer.ordersCount += 1;
    } else {
      customer = new Customer({
        ...customerInfo,
        orders: [newOrder._id],
        ordersCount: 1
      })
    }

    await customer.save();
    revalidatePath('/orders')
    return NextResponse.json({ orderId: newOrder._id }, { status: 200 });
  } catch (error) {
    console.log("NEW_ORDER.Post", error);
    return NextResponse.json((error as Error).message , { status: 500 });
  }
};
