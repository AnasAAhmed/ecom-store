import { corsHeaders } from "@/lib/cors";
import HomePage from "@/lib/models/HomePage";
import { connectToDB } from "@/lib/mongoDB";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export const DELETE = async (req: NextRequest, { params }: { params: { id: String } }) => {
    try {
        const token = req.cookies.get('authjs.admin-session')?.value
        if (!token) {
            return new NextResponse("Token is missing", {
                status: 401,
                headers: corsHeaders,
            });
        }
        const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
        if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
            return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            return new NextResponse("Session expired. Please log in again.", {
                status: 401,
                headers: corsHeaders,
            });
        }

        await connectToDB()

        await HomePage.findByIdAndDelete(params.id);

        return NextResponse.json('Successfully deleted home page data', { status: 200, headers: corsHeaders })
    } catch (err) {
        console.log("[home-page_DELETE]", err)
        return new NextResponse((err as Error).message, { status: 500, headers: corsHeaders })
    }
}