import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import { connectToDB } from "@/lib/mongoDB";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId')!;
  try {
    await connectToDB();

    const body = await request.json();
    const { rating, comment, email, name, userId, photo } = body;

    if (!productId || !userId || !email || !name || !comment || !rating) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const isReviewed = await Review.findOne({ userId, productId: product._id });

    if (isReviewed) {
      const oldRating = isReviewed.rating;
      isReviewed.rating = rating;
      isReviewed.comment = comment;
      isReviewed.createdAt = new Date();
      await isReviewed.save();
      product.ratings = ((product.ratings * product.numOfReviews) - oldRating + rating) / product.numOfReviews;
    } else {
      await Review.create({
        userId,
        name,
        email,
        productId,
        rating: Number(rating),
        photo,
        comment,
      });
      product.numOfReviews += 1;
      product.ratings = ((product.ratings * (product.numOfReviews - 1)) + rating) / product.numOfReviews;
    }

    await product.save({ validateBeforeSave: false });

    return NextResponse.json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export async function DELETE(request: NextRequest) {
  try {
    await connectToDB();

    const userId = request.headers.get('userId');
    const reviewId = request.headers.get('reviewId');
    const productId = request.headers.get('productId');

    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.numOfReviews -= 1;
    if (product.numOfReviews === 0) {
      product.ratings = 0;
    } else {
      product.ratings = ((product.ratings * (product.numOfReviews)) - review.rating) / product.numOfReviews;
    }

    await product.save();
    return NextResponse.json({
      success: true,
      message: "Review Deleted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
