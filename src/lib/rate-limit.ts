/**
 * Rate Limiting Module for Authentication Protection
 * 
 * Uses Upstash Redis for distributed rate limiting.
 * Falls back gracefully (fail-open) if Redis is unavailable.
 * 
 * @see https://github.com/upstash/ratelimit
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Environment variables for Upstash Redis
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Rate limiter configuration for auth routes
 * 
 * Strategy: Sliding window - smoother rate limiting than fixed window
 * Limit: 5 requests per 60 seconds per IP
 * 
 * For login specifically, this prevents:
 * - Brute-force password attacks
 * - Credential stuffing
 * - Account enumeration via timing attacks
 */
let authRateLimiter: Ratelimit | null = null;

// Only initialize if Redis credentials are available
if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
    try {
        const redis = new Redis({
            url: UPSTASH_REDIS_REST_URL,
            token: UPSTASH_REDIS_REST_TOKEN,
        });

        authRateLimiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(5, '60 s'),
            analytics: true, // Enable Upstash analytics dashboard
            prefix: 'ratelimit:auth', // Namespace for auth routes
        });
    } catch (error) {
        console.error('[RateLimit] Failed to initialize Upstash Redis:', error);
        // authRateLimiter remains null - fail-open behavior
    }
}

/**
 * In-memory rate limiter for development/testing
 * 
 * WARNING: This is NOT suitable for production serverless environments:
 * - Cold starts reset the counter
 * - No distribution across instances
 * - Memory grows unbounded without cleanup
 * 
 * Use only for local development without Redis.
 */
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();
const IN_MEMORY_LIMIT = 5;
const IN_MEMORY_WINDOW_MS = 60 * 1000; // 60 seconds

function checkInMemoryLimit(identifier: string): { success: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const record = inMemoryStore.get(identifier);

    if (!record || now > record.resetAt) {
        // First request or window expired - allow and reset
        inMemoryStore.set(identifier, { count: 1, resetAt: now + IN_MEMORY_WINDOW_MS });
        return { success: true, remaining: IN_MEMORY_LIMIT - 1, reset: Math.ceil((now + IN_MEMORY_WINDOW_MS) / 1000) };
    }

    if (record.count >= IN_MEMORY_LIMIT) {
        // Limit exceeded
        return { success: false, remaining: 0, reset: Math.ceil(record.resetAt / 1000) };
    }

    // Increment and allow
    record.count++;
    return { success: true, remaining: IN_MEMORY_LIMIT - record.count, reset: Math.ceil(record.resetAt / 1000) };
}

// Cleanup old entries periodically (every 5 minutes) to prevent memory leak
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        const entries = Array.from(inMemoryStore.entries());
        for (const [key, value] of entries) {
            if (now > value.resetAt) {
                inMemoryStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    reset: number;
    source: 'upstash' | 'memory' | 'bypass';
}

/**
 * Check rate limit for auth routes
 * 
 * @param identifier - Unique identifier for rate limiting (usually IP address)
 * @returns Rate limit result with success status and metadata
 * 
 * Fail-open strategy: If Redis is unavailable, fall back to in-memory,
 * then ultimately allow the request if all else fails.
 */
export async function checkAuthRateLimit(identifier: string): Promise<RateLimitResult> {
    // Try Upstash Redis first (production)
    if (authRateLimiter) {
        try {
            const result = await authRateLimiter.limit(identifier);
            return {
                success: result.success,
                remaining: result.remaining,
                reset: result.reset,
                source: 'upstash',
            };
        } catch (error) {
            console.error('[RateLimit] Upstash Redis error, failing open:', error);
            // Fall through to in-memory or bypass
        }
    }

    // Fallback to in-memory (development or Redis failure)
    if (process.env.NODE_ENV !== 'production') {
        const result = checkInMemoryLimit(identifier);
        return { ...result, source: 'memory' };
    }

    // Production with no Redis: FAIL OPEN (allow request)
    // This prevents blocking all users if Redis goes down
    console.warn('[RateLimit] No Redis available in production, allowing request (fail-open)');
    return {
        success: true,
        remaining: -1,
        reset: 0,
        source: 'bypass',
    };
}

/**
 * Extract client IP from request headers
 * 
 * Priority order for accurate IP detection behind proxies:
 * 1. x-forwarded-for (standard proxy header, first IP is the client)
 * 2. x-real-ip (some proxies use this)
 * 3. cf-connecting-ip (Cloudflare)
 * 4. Fallback to 127.0.0.1 (local development)
 * 
 * @param headers - Request headers object
 * @returns Client IP address
 */
export function getClientIP(headers: Headers): string {
    // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
    // The first IP is the original client
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        const firstIp = forwardedFor.split(',')[0].trim();
        if (firstIp) return firstIp;
    }

    // Other common proxy headers
    const realIp = headers.get('x-real-ip');
    if (realIp) return realIp;

    // Cloudflare-specific header
    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) return cfConnectingIp;

    // Fallback for local development
    return '127.0.0.1';
}
