import Wishlist from "@/lib/models/Wishlist";
import { connectToDB } from "@/lib/mongoDB";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
        }

        await connectToDB();

        let wishlist = await Wishlist.findOne({ userId: id });

        if (!wishlist) {
            wishlist = new Wishlist({
                userId: id,
                wishlist: []
            });
            await wishlist.save();
        };

        return NextResponse.json({ userId: wishlist.userId, wishlist: wishlist.wishlist }, { status: 200 });
    } catch (err) {
        console.log("[users_GET]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}