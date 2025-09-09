import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const avgPriceRange = request.headers.get('Product-IDs');
    const categoriesClicked = request.headers.get('Product-IDs');
    const recentlyViewed = request.headers.get('Product-IDs');
    try {
        const query: any = {
            _id: { $nin: recentlyViewed },
        };

        if (categoriesClicked?.length) {
            query.category = { $in: categoriesClicked };
        }

        if (avgPriceRange) {
            const parsedPriceRange = JSON.parse(avgPriceRange)
            query.price = { $gte: parsedPriceRange.min, $lte: parsedPriceRange.max };
        }
        await connectToDB();

        const products = await Product.find()
            .sort({ createdAt: -1, updatedAt: -1 })
            .select("title variants numOfReviews stock ratings sold price expense media _id")
            .limit(8);

        return NextResponse.json(
            products,
            { status: 200, statusText: 'Fetched For You prodcut successfully' }
            
        );
    } catch (err) {
        console.error("Error fetching products:", err);
        return NextResponse.json(
            { error: "Failed to fetch products: " + (err as Error).message },
            { status: 500, statusText: "Failed to fetch products: " + (err as Error).message }
        );
    }
}
