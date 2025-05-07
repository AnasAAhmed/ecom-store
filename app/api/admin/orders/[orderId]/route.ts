
import { corsHeaders } from "@/lib/cors";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { statusValidation } from "@/lib/utils/features";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { orderId: String } }) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return new NextResponse("Session expired. Please log in again.", {
        status: 401,
        headers: corsHeaders,
      });
    }
    await connectToDB()

    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product
    })

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404, headers: corsHeaders })
    }

    return NextResponse.json(orderDetails, { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[orderId_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders })
  }
}

export const PUT = async (req: NextRequest, { params }: { params: { orderId: String } }) => {
  try {
    const { status } = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return new NextResponse("Session expired. Please log in again.", {
        status: 401,
        headers: corsHeaders,
      });
    }
    await connectToDB();

    const order = await Order.findById(params.orderId);
    if (!order) return new NextResponse("Order not found", {
      status: 404,
      headers: corsHeaders
    });


    if (status) {
      order.status = statusValidation(status);
      order.statusHistory.push({
        status: status,
        changedAt: Date.now
      });
    }
    await order.save();

    return NextResponse.json("Order Status Updated Successfully", { status: 200, headers: corsHeaders })
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500, headers: corsHeaders });
    } else {
      return new NextResponse('An unknown error occurred', { status: 500, headers: corsHeaders });
    }
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { orderId: String } }) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return new NextResponse("Session expired. Please log in again.", {
        status: 401,
        headers: corsHeaders,
      });
    }
    await connectToDB()
    const order = await Order.findById(params.orderId);
    if (!order) return NextResponse.json("Order Not Found", { status: 404, headers: corsHeaders });

    await order.deleteOne();

    return NextResponse.json("Order Deleted Successfully", { status: 200, headers: corsHeaders })
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500, headers: corsHeaders });
    } else {
      return new NextResponse('An unknown error occurred', { status: 500, headers: corsHeaders });
    }
  }

};
export const dynamic = "force-dynamic";