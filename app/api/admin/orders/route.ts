import { corsHeaders } from "@/lib/cors";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { isValidObjectId } from "mongoose";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
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
  
      const { searchParams } = new URL(req.url);
      const key = searchParams.get('key')!;
      const query = searchParams.get('query')!;
      const page = searchParams.get('page')!;
  
      await connectToDB();
  
      let search: { [key: string]: any } = {};
  
      if (query) {
        if (key === 'customerEmail') search = { customerEmail: { $regex: query, $options: 'i' } };
        if (key === 'customerPhone') search = { customerPhone: { $regex: query, $options: 'i' } };
        if (key === '_id' && isValidObjectId(query)) search = { _id: query };
        if (key === 'status') search = { status: { $regex: query, $options: 'i' } };
        if (key === 'createdAt') search = { createdAt: { $regex: query, $options: 'i' } };
      }
      const totalOrders = await Order.countDocuments(search);
      if (totalOrders < 1) {
        return NextResponse.json({
          data: [],
          totalOrders,
          totalPages: 0,
        }, { status: 200, headers: corsHeaders });
      }
      const orders = await Order.find(search)
        .sort({ createdAt: 'desc' })
        .skip(Number(page) * 10)
        .limit(10)
        .select('-shippingAddress -statusHistory')
      return NextResponse.json({
        data: orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / 10),
      }, { status: 200, headers: corsHeaders });
    } catch (err) {
      console.log("[admin_orders_GET] Error:", err);
      return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
  };