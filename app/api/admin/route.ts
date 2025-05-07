import { corsHeaders } from "@/lib/cors";
import Collection from "@/lib/models/Collection";
import Customer from "@/lib/models/Customer";
import HomePage from "@/lib/models/HomePage";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const getAdminData = async () => {
  await connectToDB();
  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalOrders = await Order.countDocuments()
  const totalProducts = await Product.countDocuments({});
  const totalUsers = await Customer.countDocuments({});
  const totalCustomers = await Customer.countDocuments({ ordersCount: { $gt: 0 } });

  return { totalOrders, totalRevenue: totalRevenue[0]?.total || 0, totalProducts, totalCustomers, totalUsers }
}



const getSalesPerMonth = async () => {
  await connectToDB();

  const currentYear = new Date().getFullYear();

  const salesPerMonth = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(currentYear, 11, 31, 23, 59, 59)
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" }
      }
    },
    {
      $sort: { "_id.month": 1 }
    }
  ]);

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i));
    const monthData = salesPerMonth.find(item => item._id.month === i + 1);
    return {
      name: month,
      sales: monthData?.totalSales || 0
    };
  });

  return graphData;
};

export const GET = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
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

    const countMetrics = await getAdminData();
    const graphData = await getSalesPerMonth();

    return NextResponse.json({ countMetrics, graphData }, { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[collections_GET]", err)
    return new NextResponse((err as Error).message, { status: 500, headers: corsHeaders })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return new NextResponse("Session expired. Please log in again.", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const {
      seo, hero, collections
    } = await req.json();



    if (!hero?.imgUrl || !hero?.link) {
      return new NextResponse("Hero section missing required fields", { status: 400 });
    }
    if (!Array.isArray(collections) || collections.length === 0) {
      return new NextResponse("At least one collection is required", { status: 400 });
    }

    await connectToDB()

    const existingHomePageData = await HomePage.findOne({});
    let result;
    if (existingHomePageData) {
      result = await HomePage.findByIdAndUpdate(
        existingHomePageData,
        { seo, hero, collections },
        { new: true }
      )
    } else {
      result = await HomePage.create({ seo, hero, collections })
    }

    return NextResponse.json(result, { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[home-page_POST&PUT]", err)
    return new NextResponse((err as Error).message, { status: 500, headers: corsHeaders })
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
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

    const existingHomePageData = await HomePage.findOne({});
    await existingHomePageData.deleteOne();

    return NextResponse.json('Successfully deleted home page data', { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[home-page_DELETE]", err)
    return new NextResponse((err as Error).message, { status: 500, headers: corsHeaders })
  }
}