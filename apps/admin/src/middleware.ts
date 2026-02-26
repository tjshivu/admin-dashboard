import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check for admin_token cookie
    const token = request.cookies.get('admin_token')?.value

    // If no token and trying to access protected routes (not login)
    if (!token && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If token exists and trying to access login, redirect to dashboard
    if (token && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
