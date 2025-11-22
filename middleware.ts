import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Admin Routes Protection (/admin/*)
    if (path.startsWith('/admin')) {
        // Allow access to admin login page
        if (path === '/admin/login') {
            const adminToken = request.cookies.get('admin-token')?.value;
            if (adminToken) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.next();
        }

        // Protect all other admin routes
        const adminToken = request.cookies.get('admin-token')?.value;
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.next();
    }

    // 2. App User Routes Protection (Everything else)
    // Define public paths for the app
    const isPublicAppPath = path === '/login' || path.startsWith('/api/auth');

    const authToken = request.cookies.get('auth-token')?.value;

    if (isPublicAppPath && authToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isPublicAppPath && !authToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Matching paths
export const config = {
    matcher: [
        '/',
        '/login',
        '/admin/:path*',
        '/editor/:path*',
        // Add other protected routes here
    ],
};
