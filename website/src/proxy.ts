import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply admin auth logic to /admin routes
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_token')?.value;

        // No token + not on login → redirect to login
        if (!token && !pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Has token + on login → redirect to dashboard
        if (token && pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
