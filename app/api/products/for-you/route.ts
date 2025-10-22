import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const avgPriceRange = request.cookies.get('avgPriceRange')?.value;
    const categoriesClicked = request.cookies.get('categories')?.value;
    const recentlyViewed = request.cookies.get('Product-IDs')?.value;

    const productIds = recentlyViewed?.split(',');

    if (!categoriesClicked && !avgPriceRange) {
        return NextResponse.json(
            null,
            {
                status: 200,
                statusText: 'Fetched FY product successfully but it is null because both categories and avgPriceRange are null',
            }
        );
    };

    let query: any = {};
    try {

        const orConditions: any[] = [];

        if (productIds && productIds.length > 0) {
            const validIds = productIds.filter(id => mongoose.Types.ObjectId.isValid(id));
            if (validIds.length > 0) {
                query._id = { $nin: validIds.map(id => new mongoose.Types.ObjectId(id)) };
            }
        }
        if (categoriesClicked) {
            const parsedCategories = JSON.parse(categoriesClicked);
            const categoryKeys = Object.keys(parsedCategories);
            if (categoryKeys.length) {
                orConditions.push({ category: { $in: categoryKeys } });
            }
        }
        if (avgPriceRange) {
            const parsedPriceRange = JSON.parse(avgPriceRange);
            orConditions.push({ price: { $gte: parsedPriceRange.min, $lte: parsedPriceRange.max } });
        }

        if (orConditions.length) {
            query.$and = orConditions;
        }

        await connectToDB();

        const products = await Product.find(query)
            .select("title variants numOfReviews stock ratings sold price expense media _id")
            .limit(8);

        return NextResponse.json(
            products,
            {
                status: 200,
                statusText: 'Fetched FY product successfully',
                headers: {
                    "Cache-Control": "private, max-age=60, stale-while-revalidate=59",
                },
            }
        );
    } catch (err) {

        console.error("Error fetching ffyp products:", err);
        return NextResponse.json(
            "Failed to fetch fyp products: " + (err as Error).message,
            { status: 500, statusText: "Failed to fetch fyp products: " + (err as Error).message }
        );
    }
}
