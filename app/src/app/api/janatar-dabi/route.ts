import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';
import type { IssueType, IssueVotes, VoteResponse } from '@/types/janatar-dabi';

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

const VALID_ISSUES: IssueType[] = [
  'mosquitos',
  'water_logging',
  'traffic',
  'extortion',
  'bad_roads',
  'load_shedding',
];

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

  if (!constituencyId) {
    return NextResponse.json(
      { error: 'constituency_id is required' },
      { status: 400 }
    );
  }

  try {
    const votes = await getVotes(constituencyId);

    return NextResponse.json({
      success: true,
      constituency_id: constituencyId,
      votes,
    });
  } catch (error) {
    console.error('Error reading votes:', error);
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

    const body = await request.json();
    const { constituency_id, issue } = body;

    if (!constituency_id) {
      return NextResponse.json(
        { error: 'constituency_id is required' },
        { status: 400 }
      );
    }

    if (!issue || !VALID_ISSUES.includes(issue as IssueType)) {
      return NextResponse.json(
        { error: 'Valid issue type is required' },
        { status: 400 }
      );
    }

    const votes = await incrementVote(constituency_id, issue as IssueType);

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
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
