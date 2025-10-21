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
            return NextResponse.json(undefined, {
                status: 401,
                headers: corsHeaders,
                statusText:"Token is missing"
            });
        }
        const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
        if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
            return NextResponse.json(undefined,
                {
                    status: 401,
                    headers: corsHeaders,
                    statusText: "Access Denied for non-admin."

                });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            return NextResponse.json(undefined, {
                status: 401,
                headers: corsHeaders,
                statusText: "Session expired. Please log in again."
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
            return NextResponse.json("Access Denied for non-admin", { status: 401, headers: corsHeaders });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
            return NextResponse.json("Session expired. Please log in again.", {
                status: 401,
                headers: corsHeaders,
            });
        }

        const {
            seo, hero, collections, collectionList
        } = await req.json();



        if (!Array.isArray(hero) || hero.length === 0) {
            return NextResponse.json(
                { message: "Hero section is required and must be an array" },
                { status: 400, headers: corsHeaders }
            );
        }
        if (!Array.isArray(collectionList)) {
            return NextResponse.json(
                { message: "Collections List must be an array OR Null" },
                { status: 400, headers: corsHeaders }
            );
        }
        // Ensure all hero items have required fields
        const heroInvalid = hero.some((i: any) => !i.imgUrl || !i.imageContent?.link);
        if (heroInvalid) {
            return NextResponse.json(
                { message: "Each hero item must have an imgUrl and a link" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate collections
        if (!Array.isArray(collections) || collections.length === 0) {
            return NextResponse.json(
                { message: "At least one collection is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const collectionsInvalid = collections.some(
            (i: any) => !i.imgUrl || !i.collectionId || !i.imageContent?.link
        );

        if (collectionsInvalid) {
            return NextResponse.json(
                { message: "Each collection must have imgUrl, collectionId, and link" },
                { status: 400, headers: corsHeaders }
            );
        }


        await connectToDB()

        const existingHomePageData = await HomePage.findOne({});
        let result;
        if (existingHomePageData) {
            result = await HomePage.findByIdAndUpdate(
                existingHomePageData._id,
                { seo, hero, collections, collectionList },
                { new: true }
            )
        } else {
            result = await HomePage.create({ seo, hero, collections, collectionList })
        }
        revalidatePath('/')
        return NextResponse.json(result, { status: 200, headers: corsHeaders,statusText:'lund kha ' })
    } catch (err) {
        console.log("[home-page_POST&PUT]", err)
        return NextResponse.json({ message: (err as Error).message }, { status: 500, headers: corsHeaders })
    }
}
