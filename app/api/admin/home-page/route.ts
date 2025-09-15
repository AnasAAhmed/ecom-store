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
export const GET = async (req: NextRequest) => {
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
            return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            return NextResponse.json("Session expired. Please log in again.", {
                status: 401,
                headers: corsHeaders,
            });
        }
        await connectToDB();
        const homePage = await HomePage.findOne({});

        return NextResponse.json(homePage, {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        return NextResponse.json((error as Error).message, {
            status: 500,
            headers: corsHeaders,
        });
    }
}
export const POST = async (req: NextRequest) => {
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
            return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            return NextResponse.json("Session expired. Please log in again.", {
                status: 401,
                headers: corsHeaders,
            });
        }

        const {
            seo, hero, collections
        } = await req.json();



        if (!hero?.imgUrl || !hero?.link) {
            return NextResponse.json("Hero section missing required fields", { status: 400, headers: corsHeaders });
        }
        if (!Array.isArray(collections) || collections.length === 0) {
            return NextResponse.json("At least one collection is required", { status: 400, headers: corsHeaders });
        }

        await connectToDB()

        const existingHomePageData = await HomePage.findOne({});
        let result;
        if (existingHomePageData) {
            result = await HomePage.findByIdAndUpdate(
                existingHomePageData,
                { seo, hero, collections },
                { new: true }
            )
        } else {
            result = await HomePage.create({ seo, hero, collections })
        }
        revalidatePath('/')
        return NextResponse.json(result, { status: 200, headers: corsHeaders })
    } catch (err) {
        console.log("[home-page_POST&PUT]", err)
        return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders })
    }
}
