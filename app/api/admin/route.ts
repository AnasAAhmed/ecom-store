import { corsHeaders } from "@/lib/cors";
import Collection from "@/lib/models/Collection";
import Customer from "@/lib/models/Customer";
import HomePage from "@/lib/models/HomePage";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { decode, encode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const getAdminData = async () => {
  await connectToDB();
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        paidRevenue: {
          $sum: { $cond: [{ $eq: ["$isPaid", true] }, "$totalAmount", 0] }
        },
        codRevenue: {
          $sum: { $cond: [{ $eq: ["$isPaid", false] }, "$totalAmount", 0] }
        },
        canceledRevenue: {
          $sum: { $cond: [{ $eq: ["$status", "canceled"] }, "$totalAmount", 0] }
        },
        totalOrders: { $sum: 1 },
      }
    }
  ]);
  const totalRevenueData = result[0] || {
    totalRevenue: 0,
    paidRevenue: 0,
    codRevenue: 0,
    canceledRevenue: 0,
  };
  const totalProducts = await Product.countDocuments({});
  const totalUsers = await Customer.countDocuments({});
  const totalCustomers = await Customer.countDocuments({ ordersCount: { $gt: 0 } });

  return { totalRevenueData, totalProducts, totalCustomers, totalUsers }
}



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
        statusText: 'Admin Auth Token is missing'

      });
    }
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
      return NextResponse.json("Access Denied for non-admin", { status: 401, headers: corsHeaders, statusText: 'Access Denied for non-admin' });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken!.exp && decodedToken!.exp < now) {
      return NextResponse.json("Session expired. Please log in again.", {
        status: 401,
        headers: corsHeaders,
        statusText: 'Session expired. Please log in again.'

      });
    }

    const { searchParams } = new URL(req.url);
    const selectedMonths = searchParams.get("selectedMonths")!;

    await connectToDB()

    const countMetrics = await getAdminData();

    return NextResponse.json({ countMetrics }, { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[admin_GET]", err)
    return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders,statusText:(err as Error).message,  })
  }
}

