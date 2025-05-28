import { corsHeaders } from "@/lib/cors";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { estimateDimensions, estimateWeight } from "@/lib/utils/features";
import { decode } from "next-auth/jwt";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export const POST = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
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

    const {
      title,
      description,
      media,
      category,
      collections,
      weight,
      detailDesc,
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
        JSON.stringify("Product not found"),
        { status: 404, headers: corsHeaders }
      );
    }

    // const productCollectionIds = (product.collections as string[]).map(String);

    // const addedCollections = collections.filter(
    //   (id: string) => !productCollectionIds.includes(id)
    // );

    // const removedCollections = productCollectionIds.filter(
    //   (id: string) => !collections.includes(id)
    // );


    // await Promise.all([

    //   ...removedCollections.map((collectionId: string) =>
    //     Collection.findByIdAndUpdate(collectionId, {
    //       $pull: { products: product._id },
    //     })
    //   ),
    //   ...addedCollections.map((collectionId: string) =>
    //     Collection.findByIdAndUpdate(collectionId, {
    //       $addToSet: { products: product._id }
    //     })
    //   ),
    // ]);


    product.title = title
    product.description = description
    product.media = media
    product.detailDesc = detailDesc
    product.category = category
    product.weight = weight ?? estimateWeight(title ?? category ?? "");
    product.dimensions = dimensions ?? estimateDimensions(title ?? category ?? "");
    product.collections = collections
    product.tags = tags
    product.variants = variants
    product.stock = stock
    product.price = price
    product.expense = expense

    await product.save();

    revalidatePath('/')

    return NextResponse.json(product, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse((err as Error).message, { status: 500, headers: corsHeaders });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
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
    if (params.productId) {
      return new NextResponse(JSON.stringify("Product Id Required"), {
        status: 200,
        headers: corsHeaders
      });
    }
    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify("Product not found"),
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

    return new NextResponse(JSON.stringify("Product deleted"), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};
export const GET = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
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
    if (!params.productId) {
      return new NextResponse("Product Id is Required", {
        status: 400,
        headers: corsHeaders
      });
    }
    await connectToDB();

    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });

    if (!product) {
      return new NextResponse("Product not found", {
        status: 404,
        headers: corsHeaders
      });
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
  }
};
export const dynamic = "force-dynamic";

