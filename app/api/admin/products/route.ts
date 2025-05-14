import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import { decode } from "next-auth/jwt";
import { corsHeaders } from "@/lib/cors";
import { estimateDimensions, estimateWeight, isHex24 } from "@/lib/utils/features";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export const POST = async (req: NextRequest) => {
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
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      variants,
      detailDesc,
      dimensions,
      stock,
      weight,
      price,
      expense,
    } = await req.json();



    if (
      !title ||
      !description ||
      !media ||
      !category ||
      !price ||
      !stock) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    await connectToDB();

    const newProduct = new Product({
      title,
      description,
      media,
      detailDesc,
      weight: weight || estimateWeight(title || category),
      category,
      dimensions: dimensions || estimateDimensions(title || category),
      collections,
      tags,
      variants,
      stock,
      price,
      expense,
    });

    await newProduct.save();

    if (collections && Array.isArray(collections)) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }
    revalidatePath('/')
    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[admin_products_POST] Error:", err);
    return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
  }
};
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
      if (key === 'title') search = { $text: { '$search': 'white' } };
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
      if (key === 'category') search = { category: { $regex: query, $options: 'i' } };
    }
    const totalProducts = await Product.countDocuments(search).sort(sortOptions);
    if (totalProducts < 1) {
      return NextResponse.json({
        data: [],
        totalProducts,
        totalPages: 0,
      }, { status: 200, headers: corsHeaders });
    }
    const products = await Product.find(search)
      .sort(sortOptions)
      .skip(Number(page) * 10)
      .limit(10)
      .populate({ path: 'collections', model: Collection, select: '_id title' })
      .select("-createdAt -updatedAt -__v -media -ratings -variantColors -variantSizes -searchableVariants -detailDesc -numOfReviews -description -variants -weight -dimensions");

    return NextResponse.json({
      data: products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / 10),
    }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[admin_products_GET] Error:", err);
    return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
  }
};
export const dynamic = "force-dynamic";

