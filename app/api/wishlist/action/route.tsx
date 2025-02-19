import { connectToDB } from "@/lib/mongoDB";
import { auth, } from '@/auth'
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Wishlist from "@/lib/models/Wishlist";

export const POST = async (req: NextRequest) => {
  try {
    const session = (await auth()) as Session
    const userId = session.user?.id;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let wishList = await Wishlist.findOne({ userId: userId });

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