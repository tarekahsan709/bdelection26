import { NextRequest, NextResponse } from 'next/server';

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || realIp || 'unknown';
}

interface ApiErrorOptions {
  status?: number;
  details?: unknown;
}

export function apiError(
  message: string,
  { status = 500, details }: ApiErrorOptions = {},
): NextResponse {
  const body: { success: false; error: string; details?: unknown } = {
    success: false,
    error: message,
  };

  if (details) {
    body.details = details;
  }

  return NextResponse.json(body, { status });
}

export function apiSuccess<T extends object>(data: T): NextResponse {
  return NextResponse.json({
    success: true,
    ...data,
  });
}

interface RateLimitStore {
  [key: string]: number[];
}

const rateLimitStores: Record<string, RateLimitStore> = {};

export function checkInMemoryRateLimit(
  storeKey: string,
  ip: string,
  windowSeconds: number,
  maxRequests: number,
): boolean {
  if (!rateLimitStores[storeKey]) {
    rateLimitStores[storeKey] = {};
  }

  const store = rateLimitStores[storeKey];
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  if (!store[ip]) {
    store[ip] = [];
  }

  store[ip] = store[ip].filter((ts) => ts > windowStart);
  return store[ip].length < maxRequests;
}

export function recordInMemoryRateLimit(storeKey: string, ip: string): void {
  if (!rateLimitStores[storeKey]) {
    rateLimitStores[storeKey] = {};
  }

  const store = rateLimitStores[storeKey];
  if (!store[ip]) {
    store[ip] = [];
  }
  store[ip].push(Date.now());
}
