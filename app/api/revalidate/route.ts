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

    if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
        return NextResponse.json("Unauthorized", { status: 401, statusText: "Unauthorized" });
    }

    try {
        if (!pathToRevalidate) {
            return NextResponse.json("Path is required", { status: 400, statusText: "Unauthorized" });
        }

        revalidatePath('/');

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
