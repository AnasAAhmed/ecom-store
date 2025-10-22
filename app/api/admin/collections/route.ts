import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";
import { revalidatePath } from "next/cache";
import { decode } from "next-auth/jwt";
import { corsHeaders } from "@/lib/cors";
import mongoose from "mongoose";
import { isHex24 } from "@/lib/utils/features";

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
        status: 440,
        headers: corsHeaders,
      });
    }
    await connectToDB()

    const { title, description, image } = await req.json()
    const existingCollection = await Collection.findOne({ title })
    if (existingCollection) {
      return NextResponse.json("Collection already exists", { status: 400, headers: corsHeaders })
    }

    if (!title || !image) {
      return NextResponse.json("Title or image is missing", { status: 400, headers: corsHeaders })
    }

    const newCollection = await Collection.create({
      title,
      description,
      image,
    })

    await newCollection.save()
    revalidatePath('/');
    return NextResponse.json(newCollection, { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[collections_POST]", err)
    return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders })
  }
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
    if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
      return NextResponse.json("Access Denied for non-admin", { status: 401, headers: corsHeaders });
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
      return NextResponse.json("Session expired. Please log in again.", {
        status: 440,
        headers: corsHeaders,
      });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')! as string) || 1;
    const limit = parseInt(searchParams.get('limit')! as string) || 10;
    const query = searchParams.get('query')! as string || '';
    const sort = searchParams.get('sort')!;
    const sortField = searchParams.get('sortField')!;

    let search: any = {};

    const allowedSortFields = ["createdAt", "productCount"];
    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sortField && allowedSortFields.includes(sortField)) {
      sortOptions[sortField] = sort === "asc" ? 1 : -1;
    } else {
      sortOptions["createdAt"] = -1;
    }

    if (query) {
      if (isHex24(query)) {
        search = { _id: new mongoose.Types.ObjectId(query) };
      } else {
        search = { title: { $regex: query } }; // case-sensitive
      }
    }
    const skip = (page - 1) * limit;

    await connectToDB()

    const pipeline: any[] = [
      { $match: search },
    ];

    pipeline.push(
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          productCount: 1,
        }
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit }
    );

    const collectionsWithProductCounts = await Collection.aggregate(pipeline);

    const totalCollections = await Collection.countDocuments();
    const totalPages = Math.ceil(totalCollections / limit);
    

    return NextResponse.json({
      data: collectionsWithProductCounts,
      totalPages,
      totalCollections,
    },
      { status: 200, headers: corsHeaders })
   
  } catch (err) {
    console.log("[collections_GET]", err)
    return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders })
  }
}

export const dynamic = "force-dynamic";
