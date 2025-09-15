import { auth } from "@/auth";
import Customer from "@/lib/models/Customer";
import Wishlist from "@/lib/models/Wishlist";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = (await auth()) as Session;

    if (!session || !session.user.id) {
      return NextResponse.json(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDB();

    const user = await Customer.findById(session.user.id).select("signInHistory");
    if (!user) return NextResponse.json("User not found", { status: 404, statusText: "User not found" });

    let wishlist = await Wishlist.findOne({ userId: session.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: session.user.id,
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
      { status: 200, statusText: "User Fetch succefully" }
    );
  } catch (err) {
    console.error("[wishlist_POST]", err);
    return NextResponse.json((err as Error).message, { status: 500, statusText: (err as Error).message });
  }
};
