import { corsHeaders } from "@/lib/cors";
import HomePage from "@/lib/models/HomePage";
import { connectToDB } from "@/lib/mongoDB";
import { decode } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export const DELETE = async (req: NextRequest, props: { params: Promise<{ id: String }> }) => {
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
        if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
            return NextResponse.json("Access Denied for non-admin", { status: 401, headers: corsHeaders });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            return NextResponse.json("Session expired. Please log in again.", {
                status: 401,
                headers: corsHeaders,
            });
        }

        await connectToDB()

        await HomePage.findByIdAndDelete(params.id);
        revalidatePath('/')

        return NextResponse.json('Successfully deleted home page data', { status: 200, headers: corsHeaders })
    } catch (err) {
        console.log("[home-page_DELETE]", err)
        return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders })
    }
}