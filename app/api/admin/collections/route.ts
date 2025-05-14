import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";
import { revalidatePath } from "next/cache";
import { decode } from "next-auth/jwt";
import { corsHeaders } from "@/lib/cors";

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
    await connectToDB()

    const { title, description, image } = await req.json()
    const existingCollection = await Collection.findOne({ title })
    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400, headers: corsHeaders })
    }

    if (!title || !image) {
      return new NextResponse("Title or image is missing", { status: 400, headers: corsHeaders })
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
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders })
  }
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

    const collectionsWithProductCounts = await Collection.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'collections',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: {
          title: 1,
          productCount: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);


    return NextResponse.json(collectionsWithProductCounts, { status: 200, headers: corsHeaders })
  } catch (err) {
    console.log("[collections_GET]", err)
    return new NextResponse((err as Error).message, { status: 500, headers: corsHeaders })
  }
}

export const dynamic = "force-dynamic";
