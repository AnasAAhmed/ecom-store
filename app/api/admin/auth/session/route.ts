import { corsHeaders } from "@/lib/cors";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('authjs.admin-session')?.value
        if (!token) {
            return new NextResponse("Log-in first", {
                status: 401,
                headers: corsHeaders,
            });
        }

        const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
        if (!decodedToken || decodedToken.role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            const res = new NextResponse("Session expired. Please log in again.", {
                status: 401,
                headers: corsHeaders,
            });

            res.cookies.set("authjs.admin-session", "", {
                path: "/",
                maxAge: 0,
            });

            return res;
        }
        const user = {
            email: decodedToken.email!,
            id: decodedToken.id!,
            name: decodedToken.name!,
            image: decodedToken.image!,
        }
        return NextResponse.json(user, { status: 200, headers: corsHeaders });

    } catch (error) {

        return NextResponse.json((error as Error).message, { status: 500, headers: corsHeaders });
    }
}
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('authjs.admin-session')?.value
        if (!token) {
            return new NextResponse("Log-in first", {
                status: 401,
                headers: corsHeaders,
            });
        }

        const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
        if (!decodedToken || decodedToken.role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
        }

        const res = new NextResponse("Logout Successfully", {
            status: 200,
            headers: corsHeaders,
        });
        res.cookies.set("authjs.admin-session", "", {
            path: "/",
            maxAge: 0,
        });

        return res;

    } catch (error) {

        return NextResponse.json((error as Error).message, { status: 500, headers: corsHeaders });
    }
}
