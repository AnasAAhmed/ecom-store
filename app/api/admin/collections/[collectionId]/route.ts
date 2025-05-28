import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { revalidatePath } from "next/cache";
import { decode } from "next-auth/jwt";
import { corsHeaders } from "@/lib/cors";

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export const GET = async (req: NextRequest, props: { params: Promise<{ collectionId: string }> }) => {
  const params = await props.params;
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
    if (!params.collectionId) {
      return new NextResponse("Collection Id is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }
    await connectToDB();

    const collection = await Collection.findById(params.collectionId).populate({ path: "products", model: Product });

    if (!collection) {
      return new NextResponse(
        JSON.stringify("Collection not found"),
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(collection, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ collectionId: string }> }) => {
  const params = await props.params;
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

    await connectToDB();

    let collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404, headers: corsHeaders });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400, headers: corsHeaders });
    }

    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, description, image },
      { new: true }
    );

    await collection.save();
    revalidatePath('/');
    return NextResponse.json(collection, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collectionId_POST]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ collectionId: string }> }) => {
  const params = await props.params;
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
    await connectToDB();

    await Collection.findByIdAndDelete(params.collectionId);

    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    );
    revalidatePath('/');
    return new NextResponse("Collection is deleted", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};

export const dynamic = "force-dynamic";
