import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { email, name, clerkId } = body;

        if (!clerkId) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
        }

        await connectToDB();

        let user = await Customer.findOne({ clerkId });

        if (!user) {
            user = await Customer.create({
                clerkId,
                name,
                email,
            })
            await user.save();
        };

        return NextResponse.json({ clerkId: user.clerkId, wishlist: user.wishlist }, { status: 200 });
    } catch (err) {
        console.log("[users_GET]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}