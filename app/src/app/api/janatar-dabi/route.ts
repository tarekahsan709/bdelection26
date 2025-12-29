import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  checkInMemoryRateLimit,
  getClientIP,
  recordInMemoryRateLimit,
} from '@/lib/api-utils';
import { getRedis } from '@/lib/redis';

import {
  CONSTITUENCY_VALIDATION,
  DEFAULT_ISSUE_VOTES,
  JANATAR_DABI_KEYS,
  JANATAR_DABI_RATE_LIMIT,
  TURNSTILE_VERIFY_URL,
  VALID_ISSUES,
} from '@/constants/api';

import type { IssueType, IssueVotes, VoteResponse } from '@/types/janatar-dabi';

const constituencyIdSchema = z
  .string()
  .min(1)
  .max(3)
  .regex(CONSTITUENCY_VALIDATION.PATTERN, 'Invalid constituency ID format')
  .refine((val) => {
    const num = parseInt(val, 10);
    return (
      num >= CONSTITUENCY_VALIDATION.MIN_ID &&
      num <= CONSTITUENCY_VALIDATION.MAX_ID
    );
  }, 'Constituency ID must be between 1 and 300');

const issueSchema = z.enum(VALID_ISSUES);

const voteRequestSchema = z.object({
  constituency_id: constituencyIdSchema,
  issue: issueSchema,
  turnstile_token: z.string().min(1, 'Turnstile token is required'),
});

const inMemoryVoteStore: Record<string, IssueVotes> = {};

async function verifyTurnstileToken(
  token: string,
  ip: string,
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return false;

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
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

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  const { WINDOW_SECONDS, MAX_REQUESTS } = JANATAR_DABI_RATE_LIMIT;

  if (!redis) {
    return checkInMemoryRateLimit(
      'janatar_dabi',
      ip,
      WINDOW_SECONDS,
      MAX_REQUESTS,
    );
  }

  const key = `${JANATAR_DABI_KEYS.RATE_LIMIT}${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  return count <= MAX_REQUESTS;
}

async function getVotes(constituencyId: string): Promise<IssueVotes> {
  const redis = getRedis();

  if (!redis) {
    return inMemoryVoteStore[constituencyId] || { ...DEFAULT_ISSUE_VOTES };
  }

  const key = `${JANATAR_DABI_KEYS.VOTES}${constituencyId}`;
  const data = await redis.hgetall(key);

  if (!data || Object.keys(data).length === 0) {
    return { ...DEFAULT_ISSUE_VOTES };
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

async function incrementVote(
  constituencyId: string,
  issue: IssueType,
): Promise<IssueVotes> {
  const redis = getRedis();

  if (!redis) {
    if (!inMemoryVoteStore[constituencyId]) {
      inMemoryVoteStore[constituencyId] = { ...DEFAULT_ISSUE_VOTES };
    }
    inMemoryVoteStore[constituencyId][issue]++;
    return { ...inMemoryVoteStore[constituencyId] };
  }

  const key = `${JANATAR_DABI_KEYS.VOTES}${constituencyId}`;
  await redis.hincrby(key, issue, 1);
  return getVotes(constituencyId);
}

// =============================================================================
// Route Handlers
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const constituencyId = searchParams.get('constituency_id');

  const parseResult = constituencyIdSchema.safeParse(constituencyId);
  if (!parseResult.success) {
    return apiError('Invalid constituency_id', {
      status: 400,
      details: parseResult.error.flatten(),
    });
  }

  try {
    const votes = await getVotes(parseResult.data);

    return NextResponse.json({
      success: true,
      constituency_id: parseResult.data,
      votes,
    });
  } catch {
    return apiError('Failed to read votes');
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const withinLimit = await checkRateLimit(clientIP);

    if (!withinLimit) {
      return apiError('Too many requests. Please wait before voting again.', {
        status: 429,
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON body', { status: 400 });
    }

    const parseResult = voteRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError('Invalid request data', {
        status: 400,
        details: parseResult.error.flatten(),
      });
    }

    const { constituency_id, issue, turnstile_token } = parseResult.data;

    const isValidToken = await verifyTurnstileToken(turnstile_token, clientIP);
    if (!isValidToken) {
      return apiError('CAPTCHA verification failed. Please try again.', {
        status: 403,
      });
    }

    const votes = await incrementVote(constituency_id, issue);

    // Record rate limit for in-memory fallback
    if (!getRedis()) {
      recordInMemoryRateLimit('janatar_dabi', clientIP);
    }

    const response: VoteResponse = {
      success: true,
      votes,
      message: 'Vote recorded successfully',
    };

    return NextResponse.json(response);
  } catch {
    return apiError('Failed to record vote');
  }
}
