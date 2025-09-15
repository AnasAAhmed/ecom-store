
import { corsHeaders } from "@/lib/cors";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { statusValidation } from "@/lib/utils/features";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export const GET = async (req: NextRequest, props: { params: Promise<{ orderId: String }> }) => {
  const params = await props.params;
  try {
    const token = req.cookies.get('authjs.admin-session')?.value
    if (!token) {
      return NextResponse.json("Token is missing", {
        status: 401,
        headers: corsHeaders,
      });
    }
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return NextResponse.json("Session expired. Please log in again.", {
        status: 401,
        headers: corsHeaders,
      });
    }
    if (!params.orderId) {
      return NextResponse.json(JSON.stringify("Order is missing"), { status: 404, headers: corsHeaders })
    }
    await connectToDB()

    const orderDetails = await Order.findById(params.orderId)
      .populate({ path: "products.product", model: Product, select: '_id title media price' })
      .select("-__v -updatedAt");

    if (!orderDetails) {
      return NextResponse.json(JSON.stringify("Order Not Found"), { status: 404, headers: corsHeaders })
    }

    return NextResponse.json(orderDetails, { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[orderId_GET]", err)
    return NextResponse.json("Internal Server Error: " + (err as Error).message, { status: 500, headers: corsHeaders })
  }
}

export const PUT = async (req: NextRequest, props: { params: Promise<{ orderId: String }> }) => {
  const params = await props.params;
  try {
    const { status } = await req.json();

    const token = req.cookies.get('authjs.admin-session')?.value
    if (!token) {
      return NextResponse.json("Token is missing", {
        status: 401,
        headers: corsHeaders,
      });
    }
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json("Access Denied for non-admin", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return NextResponse.json("Session expired. Please log in again.", {
        status: 401,
        statusText: "Session expired. Please log in again.",
        headers: corsHeaders,
      });
    }
    if (!params.orderId) {
      return NextResponse.json(JSON.stringify("OrderId is missing"), { status: 404, headers: corsHeaders, statusText: "OrderId is missing", })
    }
    await connectToDB();

    const order = await Order.findById(params.orderId);
    if (!order) return NextResponse.json("Order not found", {
      status: 404,
      headers: corsHeaders
      , statusText: "OrderId is missing"
    });


    if (status) {
      order.status = statusValidation(status);
      order.statusHistory.push({
        status: status,
        changedAt: Date.now()
      });
    }
    await order.save();

    return NextResponse.json("Order Status Updated Successfully", { status: 200, statusText: "Order Status Updated Successfully", headers: corsHeaders })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(`Internal Server Error: ${error.message}`, { status: 500, statusText: `Internal Server Error: ${error.message}`, headers: corsHeaders });
    } else {
      return NextResponse.json('An unknown error occurred', { status: 500, statusText: 'An unknown error occurred', headers: corsHeaders });
    }
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ orderId: String }> }) => {
  const params = await props.params;
  try {
    const token = req.cookies.get('authjs.admin-session')?.value
    if (!token) {
      return NextResponse.json("Token is missing", {
        status: 401,
        headers: corsHeaders,
      });
    }
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return NextResponse.json("Session expired. Please log in again.", {
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
      return NextResponse.json(`Internal Server Error: ${error.message}`, { status: 500, headers: corsHeaders });
    } else {
      return NextResponse.json('An unknown error occurred', { status: 500, headers: corsHeaders });
    }
  }
};
export const dynamic = "force-dynamic";