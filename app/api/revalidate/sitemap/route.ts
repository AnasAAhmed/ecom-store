
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json('Invalid token', { status: 401, statusText: 'Invalid token' });
  }

  try {
    // This will revalidate the static sitemap.xml route
    await fetch(`${process.env.ECOM_STORE_URL}/sitemap.xml`, {
      method: 'PURGE',
    });

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json((err as Error).message, { status: 500, statusText: (err as Error).message });
  }
}
