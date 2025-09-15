import { corsHeaders } from "@/lib/cors";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";
import { isHex21, isHex24 } from "@/lib/utils/features";
import mongoose from "mongoose";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export const GET = async (req: NextRequest) => {
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

    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key')!;
    const query = searchParams.get('query')!;
    const page = searchParams.get('page')!;
    const sort = searchParams.get('sort')!;
    const sortField = searchParams.get('sortField')!;

    const allowedSortFields = ["ordersCount", "createdAt", 'googleId'];
    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sort && sortField) {
      const sortOrder = sort === "asc" ? 1 : -1;
      sortOptions[sortField] = sortOrder;
    } else {
      sortOptions['createdAt'] = -1;
    }
    await connectToDB();

    let search: { [key: string]: any } = {};

    if (query) {
      if (key === 'email') search = { email: { $regex: query, $options: 'i' } };
      if (key === '_id') {
        if (isHex24(query)) {
          search = { _id: new mongoose.Types.ObjectId(query) };
        } else {
          return NextResponse.json({
            data: [],
            totalOrders: 0,
            totalPages: 0,
          }, { status: 200, headers: corsHeaders ,statusText:'_id is invalid it should be 24 digits' });
        }
      }
      if (key === 'googleId') {
        if (isHex21(query)) {
          search = { googleId: query };
        } else {
          return NextResponse.json({
            data: [],
            totalOrders: 0,
            totalPages: 0,
          }, { status: 200, headers: corsHeaders,statusText:'googleId is invalid it should be 21 digits' });
        }
      }
      if (key === 'name') search = { name: { $regex: query, $options: 'i' } };
    }
    const totalCustomers = await Customer.countDocuments(search).sort(sortOptions);
    if (totalCustomers < 1) {
      return NextResponse.json({
        data: [],
        totalCustomers,
        totalPages: 0,
      }, { status: 200, headers: corsHeaders });
    }
    const customers = await Customer.find(search)
      .sort(sortOptions)
      .skip(Number(page) * 10)
      .limit(10)
      .select('-reset_token -token_expires -signInHistory -updatedAt -__v -orders -role -password')
    return NextResponse.json({
      data: customers,
      totalCustomers,
      totalPages: Math.ceil(totalCustomers / 10),
    }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[admin_customers_GET] Error:", err);
    return NextResponse.json("Internal Error", { status: 500, headers: corsHeaders });
  }
};