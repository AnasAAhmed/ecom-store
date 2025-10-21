import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { decode } from "next-auth/jwt";

const corsHeaders = {
    "Access-Control-Allow-Origin": `${process.env.ADMIN_STORE_URL}`,
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pathToRevalidate = searchParams.get('path')!;
    const tagToRevalidate = searchParams.get('tag')!;

    const token = req.cookies.get('authjs.admin-session')?.value
    if (!token) {
        return NextResponse.json("Token is missing", {
            status: 401,
        });
    }
    const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
    if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
        return NextResponse.json("Access Denied for non-admin", { status: 401});
    }
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < now) {
        return NextResponse.json("Session expired. Please log in again.", {
            status: 440,
        });
    }
    if (!tagToRevalidate && !pathToRevalidate) {
        return NextResponse.json("Path OR Tag is required", { status: 403, statusText: "Forbidden" });

    }
    try {
        if (pathToRevalidate) {
            revalidatePath(pathToRevalidate);
        }
        if (tagToRevalidate) {
            revalidateTag(tagToRevalidate)
        }


        return NextResponse.json(`Revalidation triggered for path: ${pathToRevalidate}`, {
            status: 200,
            headers: corsHeaders,
            statusText: `Revalidation triggered for path: ${pathToRevalidate}`,
        });
    } catch (error) {
        console.error('Error triggering revalidation:', error);
        return NextResponse.json((error as Error).message, { status: 500, statusText: (error as Error).message });
    }
}
