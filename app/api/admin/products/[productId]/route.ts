import { corsHeaders } from "@/lib/cors";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { estimateDimensions, estimateWeight, extractKeyFromUrl } from "@/lib/utils/features";
import { decode } from "next-auth/jwt";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export const POST = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
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
      return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders });
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
      return NextResponse.json("Not enough data to Update a new product", {
        status: 400,
        headers: corsHeaders
      });
    }
    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return NextResponse.json(
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
    return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
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
      return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders });
    }
    if (!params.productId) {
      return NextResponse.json(JSON.stringify("Product Id Required"), {
        status: 400,
        headers: corsHeaders
      });
    }
    const utapi = new UTApi();


    await connectToDB();
    const product = await Product.findOneAndDelete({ _id: params.productId }).select('collections media');

    if (!product) {
      return NextResponse.json(
        JSON.stringify("Product not found"),
        { status: 404, headers: corsHeaders }
      );
    }
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    let deleteRes: {
      readonly success: boolean | null;
      readonly deletedCount: number;
    } = { success: null, deletedCount: 0 }

    if (deleteImagesToo && product.media.length > 0) {
      console.log("Parsed removeImageUrls:", product.media);
      const keysToDelete = product.media.map(extractKeyFromUrl);
      console.log("Keys to delete:", keysToDelete);
      try {
        const deleteResult = await utapi.deleteFiles(keysToDelete);
        console.log("Delete result:", deleteResult);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    revalidatePath('/')

    return NextResponse.json(JSON.stringify(`Product deleted ${deleteRes!.success ? 'with images' : ""}`), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return NextResponse.json("Internal error", { status: 500, headers: corsHeaders });
  }
};
export const GET = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
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
      return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders });
    }
    if (!params.productId) {
      return NextResponse.json("Product Id is Required", {
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
      return NextResponse.json("Product not found", {
        status: 404,
        headers: corsHeaders
      });
    }

    return NextResponse.json(JSON.stringify(product), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return NextResponse.json("Internal error", { status: 500, headers: corsHeaders });
  }
};
export const dynamic = "force-dynamic";

