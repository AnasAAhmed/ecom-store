import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const corsHeaders = {
    "Access-Control-Allow-Origin": `${process.env.ADMIN_STORE_URL}`,
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pathToRevalidate = searchParams.get('path')!;

    const secret = searchParams.get('secret');

    if (secret !== "pandu-boom") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        if (!pathToRevalidate) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        revalidatePath('/');

        return NextResponse.json({ message: `Revalidation triggered for path: ${pathToRevalidate}` }, {
            status: 200,
            headers: corsHeaders
        });
    } catch (error) {
        console.error('Error triggering revalidation:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
