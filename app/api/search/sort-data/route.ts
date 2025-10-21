import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        await connectToDB();

        const getDistinctProductData = unstable_cache(
            async () => {
                // Query only once from MongoDB
                const [categories, variantSizes, variantColors] = await Promise.all([
                    Product.distinct("category"),
                    Product.distinct("variantSizes"),
                    Product.distinct("variantColors"),
                ]);

                return {
                    categories: categories.filter(Boolean),
                    variantSizes: variantSizes.filter(Boolean),
                    variantColors: variantColors.filter(Boolean),
                };
            },
            ["sort-data"],
            { revalidate: 60 * 60 * 24 * 7, tags: ["sort-data"] }) // 7 days

        const data = await getDistinctProductData();

        return NextResponse.json({ success: true, data },
            { status: 200 });
    } catch (err) {
        console.log("[sort_data]", err);
        return NextResponse.json((err as Error).message, { status: 500, statusText: (err as Error).message });
    }
};
export const dynamic = "force-dynamic";

