import { corsHeaders } from "@/lib/cors";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { isHex24 } from "@/lib/utils/features";
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
      return new NextResponse("Token is missing", {
        status: 401,
        headers: corsHeaders,
      });
    }
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
    const sort = searchParams.get('sort')!;
    const sortField = searchParams.get('sortField')!;

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
      if (key === 'customerEmail') search = { customerEmail: { $regex: query, $options: 'i' } };
      if (key === 'customerPhone') search = { customerPhone: { $regex: query, $options: 'i' } };
      if (key === '_id') {
        if (isHex24(query)) {
          search = { _id: new mongoose.Types.ObjectId(query) };
        } else {
          return NextResponse.json({
            data: [],
            totalOrders: 0,
            totalPages: 0,
          }, { status: 200, headers: corsHeaders });
        }
      }

      if (key === 'status') search = { status: { $regex: query, $options: 'i' } };
      if (key === 'createdAt') {
        const queryDate = new Date(query);
        const lowerBound = new Date(queryDate);
        const upperBound = new Date(queryDate);
        lowerBound.setDate(queryDate.getDate() - 3);
        upperBound.setDate(queryDate.getDate() + 4);

        const pageNumber = Number(page);

        const orders = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: lowerBound, $lt: upperBound },
            },
          },
          {
            $addFields: {
              dateDiff: {
                $abs: { $subtract: ["$createdAt", queryDate] },
              },
            },
          },
          {
            $sort: { dateDiff: 1 }, // Sort by how close the date is
          },
          {
            $skip: pageNumber * 10,
          },
          {
            $limit: 10,
          },
          {
            $project: {
              shippingAddress: 0,
              customerPhone: 0,
              __v: 0,
              "products.color": 0,
              "products.size": 0,
              statusHistory: 0,
            },
          },
        ]);

        const totalOrders = await Order.countDocuments({
          createdAt: { $gte: lowerBound, $lt: upperBound },
        });

        return NextResponse.json({
          data: orders,
          totalOrders,
          totalPages: Math.ceil(totalOrders / 10),
        }, { status: 200, headers: corsHeaders });
      }

    }
    const totalOrders = await Order.countDocuments(search).sort(sortOptions);
    if (totalOrders < 1) {
      return NextResponse.json({
        data: [],
        totalOrders,
        totalPages: 0,
      }, { status: 200, headers: corsHeaders });
    }
    const orders = await Order.find(search)
      .sort(sortOptions)
      .skip(Number(page) * 10)
      .limit(10)
      .select('-shippingAddress -customerPhone -__v -products.product -products.variantId -products.color -products.size -statusHistory')
    return NextResponse.json({
      data: orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / 10),
    }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[admin_orders_GET] Error:", err);
    return new NextResponse((err as Error).message + " Internal Error", { status: 500, headers: corsHeaders });
  }
};