import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import type { IssueType, IssueVotes, VoteResponse } from '@/types/janatar-dabi';

// Zod schemas for strict input validation
const constituencyIdSchema = z
  .string()
  .min(1)
  .max(3)
  .regex(/^[1-9][0-9]{0,2}$/, 'Invalid constituency ID format')
  .refine((val) => {
    const num = parseInt(val, 10);
    return num >= 1 && num <= 300;
  }, 'Constituency ID must be between 1 and 300');

const issueSchema = z.enum([
  'mosquitos',
  'water_logging',
  'traffic',
  'extortion',
  'bad_roads',
  'load_shedding',
]);

const voteRequestSchema = z.object({
  constituency_id: constituencyIdSchema,
  issue: issueSchema,
  turnstile_token: z.string().min(1, 'Turnstile token is required'),
});

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// Redis client - connects to Railway Redis via REDIS_URL env var
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

// Fallback in-memory store when Redis is not available (local dev)
const inMemoryStore: Record<string, IssueVotes> = {};
const rateLimitStore: Record<string, number[]> = {};

const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds
const MAX_VOTES_PER_WINDOW = 10;
const VOTES_KEY_PREFIX = 'janatar_dabi:votes:';
const RATE_LIMIT_KEY_PREFIX = 'janatar_dabi:ratelimit:';

const DEFAULT_VOTES: IssueVotes = {
  mosquitos: 0,
  water_logging: 0,
  traffic: 0,
  extortion: 0,
  bad_roads: 0,
  load_shedding: 0,
};

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || realIp || 'unknown';
}

// Redis-based rate limiting
async function checkRateLimit(ip: string): Promise<boolean> {
  if (!redis) {
    // Fallback to in-memory
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW * 1000;
    if (!rateLimitStore[ip]) rateLimitStore[ip] = [];
    rateLimitStore[ip] = rateLimitStore[ip].filter((ts) => ts > windowStart);
    return rateLimitStore[ip].length < MAX_VOTES_PER_WINDOW;
  }

  const key = `${RATE_LIMIT_KEY_PREFIX}${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }

  return count <= MAX_VOTES_PER_WINDOW;
}

function recordInMemoryRateLimit(ip: string): void {
  if (!rateLimitStore[ip]) rateLimitStore[ip] = [];
  rateLimitStore[ip].push(Date.now());
}

// Get votes from Redis or in-memory
async function getVotes(constituencyId: string): Promise<IssueVotes> {
  if (!redis) {
    return inMemoryStore[constituencyId] || { ...DEFAULT_VOTES };
  }

  const key = `${VOTES_KEY_PREFIX}${constituencyId}`;
  const data = await redis.hgetall(key);

  if (!data || Object.keys(data).length === 0) {
    return { ...DEFAULT_VOTES };
  }

  return {
    mosquitos: parseInt(data.mosquitos || '0', 10),
    water_logging: parseInt(data.water_logging || '0', 10),
    traffic: parseInt(data.traffic || '0', 10),
    extortion: parseInt(data.extortion || '0', 10),
    bad_roads: parseInt(data.bad_roads || '0', 10),
    load_shedding: parseInt(data.load_shedding || '0', 10),
  };
}

// Increment vote in Redis or in-memory
async function incrementVote(
  constituencyId: string,
  issue: IssueType
): Promise<IssueVotes> {
  if (!redis) {
    if (!inMemoryStore[constituencyId]) {
      inMemoryStore[constituencyId] = { ...DEFAULT_VOTES };
    }
    inMemoryStore[constituencyId][issue]++;
    return { ...inMemoryStore[constituencyId] };
  }

  const key = `${VOTES_KEY_PREFIX}${constituencyId}`;
  await redis.hincrby(key, issue, 1);
  return getVotes(constituencyId);
}

// GET /api/janatar-dabi?constituency_id=1
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const constituencyId = searchParams.get('constituency_id');

  // Validate constituency_id with Zod
  const parseResult = constituencyIdSchema.safeParse(constituencyId);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid constituency_id', details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const votes = await getVotes(parseResult.data);

    return NextResponse.json({
      success: true,
      constituency_id: parseResult.data,
      votes,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to read votes' },
      { status: 500 }
    );
  }
}

// POST /api/janatar-dabi
// Body: { constituency_id: string, issue: IssueType }
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const withinLimit = await checkRateLimit(clientIP);

    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before voting again.' },
        { status: 429 }
      );
    }

    // Parse and validate request body with Zod
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const parseResult = voteRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { constituency_id, issue, turnstile_token } = parseResult.data;

    // Verify Turnstile CAPTCHA token
    const isValidToken = await verifyTurnstileToken(turnstile_token, clientIP);
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 403 }
      );
    }

    const votes = await incrementVote(constituency_id, issue);

    // Record rate limit for in-memory fallback
    if (!redis) {
      recordInMemoryRateLimit(clientIP);
    }

    const response: VoteResponse = {
      success: true,
      votes,
      message: 'Vote recorded successfully',
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
