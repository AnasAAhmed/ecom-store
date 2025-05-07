import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import { decode } from "next-auth/jwt";
import { corsHeaders } from "@/lib/cors";
import { estimateDimensions, estimateWeight, slugify } from "@/lib/utils/features";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";

export const POST = async (req: NextRequest) => {
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
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      variants,
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
      if (key === 'title') search = { $text: { '$search': 'white' } };
      if (key === '_id' && isValidObjectId(query)) search = { _id: query };
      if (key === 'category') search = { category: { $regex: query, $options: 'i' } };
    }
    const totalProducts = await Product.countDocuments(search);
    if (totalProducts < 1) {
      return NextResponse.json({
        data: [],
        totalProducts,
        totalPages: 0,
      }, { status: 200, headers: corsHeaders });
    }
    const products = await Product.find(search)
      .sort({ createdAt: 'desc' })
      .skip(Number(page) * 10)
      .limit(10)
      .populate({ path: 'collections', model: Collection })
      .select("-media -ratings -numOfReviews -description -variants -weight -dimensions");

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

