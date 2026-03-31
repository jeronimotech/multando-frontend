import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/reports',
  '/wallet',
  '/achievements',
  '/profile',
  '/verify',
  '/rewards',
];

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies
  const token = request.cookies.get('multando_token')?.value;

  // Protected routes: redirect to login if no token
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes: redirect to dashboard if already logged in
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/reports/:path*',
    '/wallet/:path*',
    '/achievements/:path*',
    '/profile/:path*',
    '/verify/:path*',
    '/rewards/:path*',
    '/login',
    '/register',
  ],
};
