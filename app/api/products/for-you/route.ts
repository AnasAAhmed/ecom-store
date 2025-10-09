import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { HttpError } from '@/lib/utils/features';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const avgPriceRange = request.cookies.get('avgPriceRange')?.value;
    const categoriesClicked = request.cookies.get('categories')?.value;
    const recentlyViewed = request.cookies.get('Product-IDs')?.value;

    const productIds = recentlyViewed?.split(',');

    if (!avgPriceRange || !categoriesClicked || !recentlyViewed) {
        throw new HttpError('Values are missing', 403);
    }
    try {
        const orConditions: any[] = [];

        if (productIds?.length) {
            orConditions.push({ _id: { $nin: productIds } });
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

        const query = orConditions.length > 0 ? { $or: orConditions } : {};

        await connectToDB();

        const products = await Product.find(query)
            .select("title variants numOfReviews stock ratings sold price expense media _id")
            .limit(8);

        return NextResponse.json(
            products,
            {
                status: 200,
                statusText: 'Fetched For You product successfully',
                headers: {
                    "Cache-Control": "public, s-maxage=120, stale-while-revalidate=59",
                },
            }

        );
    } catch (err) {
        if (err instanceof HttpError) {
            return NextResponse.json(
                "Failed to fetch products: " + err.message,
                { status: err.status, statusText: "Failed to fetch fyp products: " + err.message }
            );
        }
        console.error("Error fetching products:", err);
        return NextResponse.json(
            "Failed to fetch products: " + (err as Error).message,
            { status: 500, statusText: "Failed to fetch fyp products: " + (err as Error).message }
        );
    }
}
