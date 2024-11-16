import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {

        await connectToDB();

        const productIdsHeader = request.headers.get('Product-IDs');

        if (!productIdsHeader) {
            return NextResponse.json({ error: "Product-IDs header is missing" }, { status: 400 });
        }

        const productIds = JSON.parse(productIdsHeader) as string[];

        const products = await Product.find({ _id: { $in: productIds } }).select('_id variants stock');

        return NextResponse.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
