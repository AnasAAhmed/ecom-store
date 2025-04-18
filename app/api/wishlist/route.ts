import Customer from "@/lib/models/Customer";
import Wishlist from "@/lib/models/Wishlist";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDB();

    const user = await Customer.findById(userId).select("signInHistory country city");
    if (!user) return new NextResponse("User not found", { status: 404 });

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        wishlist: [],
      });
      await wishlist.save();
    }

    return NextResponse.json(
      {
        userId: wishlist.userId,
        wishlist: wishlist.wishlist,
        signInHistory: user.signInHistory || [],
        country: user.country,
        city: user.city,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[wishlist_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
