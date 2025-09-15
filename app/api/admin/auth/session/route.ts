import { corsHeaders } from "@/lib/cors";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('authjs.admin-session')?.value
        if (!token) {
            return NextResponse.json("Log-in first", {
                status: 401,
                headers: corsHeaders,
            });
        }

        const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
        if (!decodedToken) {
            // if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
            return NextResponse.json("Access Denied for non-admin", { status: 401, headers: corsHeaders });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            const res = NextResponse.json("Session expired. Please log in again.", {
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
            return NextResponse.json("Log-in first", {
                status: 401,
                headers: corsHeaders,
            });
        }

        const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
        // if (!decodedToken || decodedToken.role !== 'admin') {
        //     return NextResponse.json("Access Denied for non-admin", { status: 401, headers: corsHeaders });
        // }

        const res = NextResponse.json("Logout Successfully", {
            status: 200,
            headers: corsHeaders,
        });
        res.cookies.set("authjs.admin-session", "", {
            path: "/",
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res;

    } catch (error) {

        return NextResponse.json((error as Error).message, { status: 500, headers: corsHeaders });
    }
}
