import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import type { MemePulseResponse, VideoItem } from '@/types/meme-pulse';
import { BLOCKLIST_KEYWORDS } from '@/types/meme-pulse';

const querySchema = z.object({
  district: z.string().min(1).max(100),
  sort: z.enum(['trending', 'recent']).default('trending'),
});

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 2000);
      },
    });

    redis.on('error', () => {
      redis = null;
    });
  } catch {
    redis = null;
  }
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

const CACHE_KEY_PREFIX = 'meme_pulse:';
const QUOTA_KEY = 'meme_pulse:quota';
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const STALE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days for stale data
const DAILY_QUOTA_LIMIT = 8000; // Leave buffer from 10k limit
const MAX_RESULTS = 6; // Reduced from 12 to save quota

const memoryCache: Record<
  string,
  { data: MemePulseResponse; expiresAt: number; staleAt: number }
> = {};

let memoryQuota = { count: 0, resetAt: 0 };

function getCacheKey(constituency: string, sort: string): string {
  return `${CACHE_KEY_PREFIX}${constituency.toLowerCase().replace(/\s+/g, '_')}:${sort}`;
}

function isBlocklisted(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKLIST_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword.toLowerCase()),
  );
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function checkQuota(): Promise<boolean> {
  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);

  if (redis) {
    try {
      const quotaData = await redis.get(QUOTA_KEY);
      if (quotaData) {
        const { count, resetAt } = JSON.parse(quotaData);
        if (resetAt > now) {
          return count < DAILY_QUOTA_LIMIT;
        }
      }
      return true;
    } catch {
      // Fall through to memory
    }
  }

  if (memoryQuota.resetAt < todayStart) {
    memoryQuota = { count: 0, resetAt: todayStart + 24 * 60 * 60 * 1000 };
  }
  return memoryQuota.count < DAILY_QUOTA_LIMIT;
}

async function incrementQuota(amount: number): Promise<void> {
  const todayEnd = new Date().setHours(23, 59, 59, 999);

  if (redis) {
    try {
      const quotaData = await redis.get(QUOTA_KEY);
      let count = amount;
      if (quotaData) {
        const parsed = JSON.parse(quotaData);
        if (parsed.resetAt > Date.now()) {
          count = parsed.count + amount;
        }
      }
      await redis.setex(
        QUOTA_KEY,
        Math.floor((todayEnd - Date.now()) / 1000),
        JSON.stringify({ count, resetAt: todayEnd }),
      );
    } catch {
      // Fall through to memory
    }
  }

  memoryQuota.count += amount;
}

async function fetchFromYouTube(
  district: string,
  sort: 'trending' | 'recent',
): Promise<VideoItem[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  const searchQuery = `${district} বাংলাদেশ নির্বাচন`;

  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: searchQuery,
    type: 'video',
    maxResults: String(MAX_RESULTS),
    regionCode: 'BD',
    relevanceLanguage: 'bn',
    safeSearch: 'strict',
    order: sort === 'trending' ? 'viewCount' : 'date',
    key: YOUTUBE_API_KEY,
  });

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  searchParams.set('publishedAfter', twoMonthsAgo.toISOString());

  if (sort === 'recent') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 15);
    searchParams.set('publishedAfter', weekAgo.toISOString());
  }

  const searchResponse = await fetch(`${YOUTUBE_SEARCH_URL}?${searchParams}`);
  if (!searchResponse.ok) {
    const error = await searchResponse.json();
    throw new Error(error.error?.message || 'YouTube API error');
  }

  await incrementQuota(100); // search.list costs 100 units

  const searchData = await searchResponse.json();
  const videoIds = searchData.items
    ?.map((item: { id: { videoId: string } }) => item.id.videoId)
    .filter(Boolean)
    .join(',');

  if (!videoIds) {
    return [];
  }

  const videoParams = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  const videoResponse = await fetch(`${YOUTUBE_VIDEOS_URL}?${videoParams}`);
  if (!videoResponse.ok) {
    throw new Error('Failed to fetch video details');
  }

  await incrementQuota(1); // videos.list costs 1 unit

  const videoData = await videoResponse.json();

  const videos: VideoItem[] = videoData.items
    ?.map(
      (item: {
        id: string;
        snippet: {
          title: string;
          description: string;
          channelTitle: string;
          channelId: string;
          thumbnails: {
            medium: { url: string };
            high: { url: string };
          };
          publishedAt: string;
        };
        statistics: { viewCount: string };
        contentDetails: { duration: string };
      }) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelName: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        thumbnailHigh: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount || '0', 10),
        duration: formatDuration(item.contentDetails.duration),
      }),
    )
    .filter((video: VideoItem) => {
      return !isBlocklisted(video.title) && !isBlocklisted(video.description);
    });

  return videos || [];
}

interface CacheResult {
  data: MemePulseResponse | null;
  isStale: boolean;
  isExpired: boolean;
}

async function getCachedData(cacheKey: string): Promise<CacheResult> {
  const now = Date.now();

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const data = JSON.parse(cached) as MemePulseResponse & {
          _staleAt?: number;
        };
        const staleAt = data._staleAt || 0;
        const expiresAt = new Date(data.expiresAt).getTime();
        return {
          data,
          isStale: now > staleAt,
          isExpired: now > expiresAt + STALE_TTL_SECONDS * 1000,
        };
      }
    } catch {
      // Fall through to memory cache
    }
  }

  const memCached = memoryCache[cacheKey];
  if (memCached) {
    return {
      data: memCached.data,
      isStale: now > memCached.staleAt,
      isExpired: now > memCached.expiresAt,
    };
  }

  return { data: null, isStale: true, isExpired: true };
}

async function setCachedData(
  cacheKey: string,
  data: MemePulseResponse,
): Promise<void> {
  const now = Date.now();
  const staleAt = now + CACHE_TTL_SECONDS * 1000;
  const expiresAt = now + STALE_TTL_SECONDS * 1000;

  if (redis) {
    try {
      await redis.setex(
        cacheKey,
        STALE_TTL_SECONDS,
        JSON.stringify({ ...data, _staleAt: staleAt }),
      );
    } catch {
      // Continue with memory cache
    }
  }

  memoryCache[cacheKey] = {
    data,
    staleAt,
    expiresAt,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const sort = searchParams.get('sort') || 'trending';

  const parseResult = querySchema.safeParse({ district, sort });
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid parameters' },
      { status: 400 },
    );
  }

  const { district: validDistrict, sort: validSort } = parseResult.data;
  const cacheKey = getCacheKey(validDistrict, validSort);

  const { data: cached, isStale, isExpired } = await getCachedData(cacheKey);

  // Return fresh cache immediately
  if (cached && !isStale) {
    return NextResponse.json({
      ...cached,
      source: 'cache',
    });
  }

  // Return stale cache if quota exceeded or API unavailable
  const hasQuota = await checkQuota();
  if (cached && (!hasQuota || !YOUTUBE_API_KEY)) {
    return NextResponse.json({
      ...cached,
      source: 'stale',
      message: !hasQuota
        ? 'API quota exceeded, showing cached data'
        : undefined,
    });
  }

  // No API key configured
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({
      success: true,
      district: validDistrict,
      videos: [],
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + CACHE_TTL_SECONDS * 1000).toISOString(),
      source: 'api',
      message: 'YouTube API not configured',
    });
  }

  try {
    const videos = await fetchFromYouTube(validDistrict, validSort);

    const response: MemePulseResponse = {
      success: true,
      district: validDistrict,
      videos,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + CACHE_TTL_SECONDS * 1000).toISOString(),
      source: 'api',
    };

    await setCachedData(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    // Return stale cache on API error
    if (cached && !isExpired) {
      return NextResponse.json({
        ...cached,
        source: 'stale',
        message: 'API error, showing cached data',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch videos',
      },
      { status: 500 },
    );
  }
}
