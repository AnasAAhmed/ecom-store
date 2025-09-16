import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { revalidatePath } from "next/cache";
import { decode } from "next-auth/jwt";
import { corsHeaders } from "@/lib/cors";
import { extractKeyFromUrl } from "@/lib/utils/features";
import { UTApi } from "uploadthing/server";

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
        status: 401,
        headers: corsHeaders,
      });
    }
    if (!params.collectionId) {
      return NextResponse.json("Collection Id is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }
    await connectToDB();

    const collection = await Collection.findById(params.collectionId).populate({ path: "products", model: Product });

    if (!collection) {
      return NextResponse.json(
        JSON.stringify("Collection not found"),
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(collection, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collectionId_GET]", err);
    return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ collectionId: string }> }) => {
  const params = await props.params;
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
        status: 401,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    let collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return NextResponse.json("Collection not found", { status: 404, headers: corsHeaders });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return NextResponse.json("Title and image are required", { status: 400, headers: corsHeaders });
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
    return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ collectionId: string }> }) => {
  const params = await props.params;
  const { searchParams } = new URL(req.url);
  const deleteImagesToo = searchParams.get("deleteImagesToo") === "true";
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
        status: 401,
        headers: corsHeaders,
      });
    }
    const utapi = new UTApi();
    await connectToDB();

    const collection = await Collection.findByIdAndDelete(params.collectionId);

    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    );

    let deleteRes: {
      readonly success: boolean | null;
      readonly deletedCount: number;
    } = { success: null, deletedCount: 0 }

    if (deleteImagesToo && collection.image) {
      console.log("Parsed removeImageUrls:", collection.image);
      const keyToDelete = extractKeyFromUrl(collection.image);
      console.log("Keys to delete:", keyToDelete);
      try {
        const deleteResult = await utapi.deleteFiles([keyToDelete]);
        deleteRes = deleteResult;
        console.log("Delete result:", deleteResult);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    revalidatePath('/');
    return NextResponse.json(
      `Collection is deleted ${deleteRes?.success ? 'With image' : ''}`,
      { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders });
  }
};

export const dynamic = "force-dynamic";
