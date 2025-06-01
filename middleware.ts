
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/wishlist', '/orders'];

export async function middleware(req: NextRequest) {
    const token =
        req.cookies.get('authjs.session-token')?.value ||
        req.cookies.get('__Secure-authjs.session-token')?.value;

    const { pathname } = req.nextUrl;

    const isProtected =
        protectedRoutes.includes(pathname) || pathname.startsWith('/orders/');

    if (isProtected && !token) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/wishlist', '/orders', '/orders/:path*'],
};
