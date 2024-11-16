import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let wishList = await Customer.findOne({ clerkId: userId });

    if (!wishList) {
      return new NextResponse("User not found", { status: 404 });

    }

    const { productId } = await req.json();

    if (!productId) {
      return new NextResponse("Product Id required", { status: 400 });
    }

    const productIndex = wishList.wishlist.indexOf(productId);

    let isLiked;
    if (productIndex !== -1) {
      // Dislike
      wishList.wishlist.splice(productIndex, 1);
      isLiked = false;
    } else {
      // Like
      wishList.wishlist.push(productId);
      isLiked = true;
    }

    await wishList.save();

    return NextResponse.json({ wishList, isLiked }, { status: 200 });
  } catch (err) {
    console.log("[wishlist_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
