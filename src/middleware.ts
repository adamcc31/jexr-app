import { NextResponse, NextRequest } from 'next/server'
import { checkAuthRateLimit, getClientIP } from '@/lib/rate-limit'
/**
 * Next.js Middleware
 * 
 * Runs BEFORE any page or API route handler loads.
 * This is the correct layer for rate limiting - blocks abusive requests
 * before they consume server resources or reach the database.
 * 
 * ARCHITECTURE NOTE:
 * This project uses Server Actions for login (not API routes).
 * Server Actions submit as POST requests to the PAGE route, not /api/*.
 * Therefore, we rate limit POST requests to auth-related pages.
 */
// Pages that should be rate-limited on POST (form submissions)
const AUTH_PAGES = [
    '/login',           // Direct login page
    '/register',        // Direct register page  
    '/reset-password',  // Password reset
    '/forgot-password', // Forgot password
]
// Check if path matches auth pages (handles route groups like (auth))
function isAuthPage(path: string): boolean {
    // Direct match
    if (AUTH_PAGES.includes(path)) return true
    // Handle Next.js route group paths like /(auth)/login
    // The actual URL will be /login, not /(auth)/login
    // But let's also check with route group prefix just in case
    const cleanPath = path.replace(/\/\([^)]+\)/g, '')
    if (AUTH_PAGES.includes(cleanPath)) return true
    return false
}
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const method = request.method
    // =====================================================
    // RATE LIMITING FOR AUTH PAGES (Server Actions)
    // Applied to POST requests on login/register pages
    // These are form submissions via Server Actions
    // =====================================================
    if (method === 'POST' && isAuthPage(path)) {
        // Get client IP using proxy-aware detection
        const clientIP = getClientIP(request.headers)
        // Check rate limit
        const { success, remaining, reset, source } = await checkAuthRateLimit(clientIP)
        // ALWAYS log rate limit checks (critical for debugging)
        console.log(`[RateLimit] ${method} ${path} | IP: ${clientIP} | Success: ${success} | Remaining: ${remaining} | Source: ${source}`)
        if (!success) {
            // Rate limit exceeded - return 429 Too Many Requests
            // DO NOT expose internal details in the error message
            console.warn(`[RateLimit] BLOCKED: ${clientIP} exceeded rate limit on ${path}`)
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: 'Too many requests. Please try again later.',
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                        'Retry-After': Math.max(1, reset - Math.floor(Date.now() / 1000)).toString(),
                    },
                }
            )
        }
        // Add rate limit headers to successful responses for transparency
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-pathname', path)
        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        })
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', reset.toString())
        return response
    }
    // =====================================================
    // PATHNAME HEADER
    // =====================================================
    // Consolidate header preparation.
    // If not handled by rate limiter, we create new headers here.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', path)
    // =====================================================
    // ROLE-BASED ROUTE PROTECTION
    // =====================================================
    const userRole = request.cookies.get('user_role')?.value
    if (path.startsWith('/dashboard-employer')) {
        const allowedRoles = ['employer', 'admin']
        if (userRole && !allowedRoles.includes(userRole)) {
            return NextResponse.redirect(new URL('/candidate', request.url))
        }
    }
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
}
export const config = {
    matcher: [
        // Rate limiting for auth pages
        '/login',
        '/register',
        '/reset-password',
        '/forgot-password',
        // Routes requiring middleware (layout.js checks x-pathname)
        '/dashboard-employer/:path*',
        '/candidate/:path*',
        '/admin/:path*',
    ],
}