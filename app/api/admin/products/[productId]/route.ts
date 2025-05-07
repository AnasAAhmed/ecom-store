import { corsHeaders } from "@/lib/cors";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { estimateDimensions, estimateWeight, slugify } from "@/lib/utils/features";
import { decode } from "next-auth/jwt";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const {
      title,
      description,
      media,
      category,
      collections,
      weight,
      dimensions,
      tags,
      variants,
      stock,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !stock) {
      return new NextResponse("Not enough data to Update a new product", {
        status: 400,
        headers: corsHeaders
      });
    }
    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const addedCollections = (collections as string[]).filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );

    const removedCollections = (product.collections as string[]).filter(
      (collectionId: string) => !collections.includes(collectionId)
    );
    await Promise.all([

      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $addToSet: { products: product._id }
        })
      ),
    ]);

    const updatedProduct = await product.update(
      product._id,
      {
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
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save();

    revalidatePath('/')

    return NextResponse.json(updatedProduct, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }
    if (params.productId) {
      return new NextResponse(JSON.stringify({ message: "Product Id Required" }), {
        status: 200,
        headers: corsHeaders
      });
    }
    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    await Product.findByIdAndDelete(product._id).select('collections');

    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    revalidatePath('/')

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin') {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }
    if (params.productId) {
      return new NextResponse(JSON.stringify({ message: "Product Id Required" }), {
        status: 200,
        headers: corsHeaders
      });
    }
    await connectToDB();

    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });
    const collections = await Collection.find().sort({ createdAt: "desc" })

    if (!product) {
      throw new Error("Product not found");
    }

    return new NextResponse(JSON.stringify({ product, collections }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};
export const dynamic = "force-dynamic";

