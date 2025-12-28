import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter for Edge Runtime
// In production with multiple instances, use Redis or Cloudflare's built-in rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // Max requests per minute per IP

function getClientIP(request: NextRequest): string {
  // Cloudflare
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  // Standard proxy headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  return false;
}

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (const [ip, entry] of entries) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const ip = getClientIP(request);
  const path = request.nextUrl.pathname;

  // Only rate limit API routes
  if (path.startsWith('/api/')) {
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please slow down.',
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    const entry = rateLimitMap.get(ip);
    if (entry) {
      response.headers.set('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
      response.headers.set(
        'X-RateLimit-Remaining',
        Math.max(0, MAX_REQUESTS_PER_WINDOW - entry.count).toString()
      );
    }
    return response;
  }

  // Block suspicious user agents (basic bot protection)
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /curl/i,
    /wget/i,
    /python-requests/i,
    /httpie/i,
    /postman/i,
    /insomnia/i,
  ];

  // Only block suspicious agents on voting endpoint
  if (path === '/api/janatar-dabi' && request.method === 'POST') {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userAgent)) {
        return NextResponse.json(
          { error: 'Automated requests are not allowed' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Exclude static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
