import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || '';
  const userAgent = request.headers.get('user-agent') || '';
  const response = NextResponse.next();
  response.headers.set('x-real-ip', ip);
  response.headers.set('x-user-agent', userAgent);
  return response;
}
export const config = {
    matcher: ["/login", "/signup", "/api/auth/(.*)"],
  };