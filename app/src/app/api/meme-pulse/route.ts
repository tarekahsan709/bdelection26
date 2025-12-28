import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import type { MemePulseResponse, VideoItem } from '@/types/meme-pulse';
import { BLOCKLIST_KEYWORDS } from '@/types/meme-pulse';

// Validation schema
const querySchema = z.object({
  district: z.string().min(1).max(100),
  sort: z.enum(['trending', 'recent']).default('trending'),
});

// Redis client with error handling
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

// YouTube API config
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

// Cache config
const CACHE_KEY_PREFIX = 'meme_pulse:';
const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours

// In-memory fallback cache
const memoryCache: Record<
  string,
  { data: MemePulseResponse; expiresAt: number }
> = {};

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
  // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
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

async function fetchFromYouTube(
  district: string,
  sort: 'trending' | 'recent',
): Promise<VideoItem[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  // Build search query - search by district for more results
  const searchQuery = `${district} জেলা বাংলাদেশ নির্বাচন`;

  // Search parameters
  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: searchQuery,
    type: 'video',
    maxResults: '12',
    regionCode: 'BD',
    relevanceLanguage: 'bn',
    safeSearch: 'strict',
    order: sort === 'trending' ? 'viewCount' : 'date',
    key: YOUTUBE_API_KEY,
  });

  // Always filter to last 2 months to avoid stale content
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  searchParams.set('publishedAfter', twoMonthsAgo.toISOString());

  // For recent tab, further restrict to last 15 days
  if (sort === 'recent') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 15);
    searchParams.set('publishedAfter', weekAgo.toISOString());
  }

  // Fetch search results
  const searchResponse = await fetch(`${YOUTUBE_SEARCH_URL}?${searchParams}`);
  if (!searchResponse.ok) {
    const error = await searchResponse.json();
    throw new Error(error.error?.message || 'YouTube API error');
  }

  const searchData = await searchResponse.json();
  const videoIds = searchData.items
    ?.map((item: { id: { videoId: string } }) => item.id.videoId)
    .filter(Boolean)
    .join(',');

  if (!videoIds) {
    return [];
  }

  // Fetch video details (for view count and duration)
  const videoParams = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  const videoResponse = await fetch(`${YOUTUBE_VIDEOS_URL}?${videoParams}`);
  if (!videoResponse.ok) {
    throw new Error('Failed to fetch video details');
  }

  const videoData = await videoResponse.json();

  // Transform and filter results
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
      // Filter out blocklisted content
      return !isBlocklisted(video.title) && !isBlocklisted(video.description);
    });

  return videos || [];
}

async function getCachedData(
  cacheKey: string,
): Promise<MemePulseResponse | null> {
  // Try Redis first
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Redis error, fall through to memory cache
    }
  }

  // Try memory cache
  const memCached = memoryCache[cacheKey];
  if (memCached && memCached.expiresAt > Date.now()) {
    return memCached.data;
  }

  return null;
}

async function setCachedData(
  cacheKey: string,
  data: MemePulseResponse,
): Promise<void> {
  // Set in Redis
  if (redis) {
    try {
      await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(data));
    } catch {
      // Redis error, continue with memory cache
    }
  }

  // Also set in memory cache
  memoryCache[cacheKey] = {
    data,
    expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
  };
}

// GET /api/meme-pulse?district=Dhaka&sort=trending
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const sort = searchParams.get('sort') || 'trending';

  // Validate input
  const parseResult = querySchema.safeParse({ district, sort });
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid parameters' },
      { status: 400 },
    );
  }

  const { district: validDistrict, sort: validSort } = parseResult.data;
  const cacheKey = getCacheKey(validDistrict, validSort);

  // Check cache first
  const cached = await getCachedData(cacheKey);
  if (cached) {
    return NextResponse.json({
      ...cached,
      source: 'cache',
    });
  }

  // If no YouTube API key, return empty with message
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

    // Cache the response
    await setCachedData(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
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
