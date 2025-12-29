/**
 * YouTube Data API Service
 *
 * Handles fetching videos from YouTube API with quota management.
 */

import { getRedis } from '@/lib/redis';

import {
  MEME_PULSE_CACHE,
  MEME_PULSE_KEYS,
  TIME_MS,
  YOUTUBE_API,
  YOUTUBE_QUOTA,
  YOUTUBE_SEARCH_CONFIG,
} from '@/constants/api';

import type { MemePulseResponse, VideoItem } from '@/types/meme-pulse';
import { BLOCKLIST_KEYWORDS } from '@/types/meme-pulse';

// =============================================================================
// In-Memory Fallback Stores
// =============================================================================

const memoryCache: Record<
  string,
  { data: MemePulseResponse; expiresAt: number; staleAt: number }
> = {};

let memoryQuota = { count: 0, resetAt: 0 };

// =============================================================================
// Helper Functions
// =============================================================================

export function getCacheKey(constituency: string, sort: string): string {
  return `${MEME_PULSE_KEYS.CACHE}${constituency.toLowerCase().replace(/\s+/g, '_')}:${sort}`;
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

// =============================================================================
// Quota Management
// =============================================================================

export async function checkQuota(): Promise<boolean> {
  const redis = getRedis();
  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);

  if (redis) {
    try {
      const quotaData = await redis.get(MEME_PULSE_KEYS.QUOTA);
      if (quotaData) {
        const { count, resetAt } = JSON.parse(quotaData);
        if (resetAt > now) {
          return count < YOUTUBE_QUOTA.DAILY_LIMIT;
        }
      }
      return true;
    } catch {
      // Fall through to memory
    }
  }

  if (memoryQuota.resetAt < todayStart) {
    memoryQuota = { count: 0, resetAt: todayStart + TIME_MS.DAY };
  }
  return memoryQuota.count < YOUTUBE_QUOTA.DAILY_LIMIT;
}

async function incrementQuota(amount: number): Promise<void> {
  const redis = getRedis();
  const todayEnd = new Date().setHours(23, 59, 59, 999);

  if (redis) {
    try {
      const quotaData = await redis.get(MEME_PULSE_KEYS.QUOTA);
      let count = amount;
      if (quotaData) {
        const parsed = JSON.parse(quotaData);
        if (parsed.resetAt > Date.now()) {
          count = parsed.count + amount;
        }
      }
      await redis.setex(
        MEME_PULSE_KEYS.QUOTA,
        Math.floor((todayEnd - Date.now()) / 1000),
        JSON.stringify({ count, resetAt: todayEnd }),
      );
    } catch {
      // Fall through to memory
    }
  }

  memoryQuota.count += amount;
}

// =============================================================================
// Cache Management
// =============================================================================

export interface CacheResult {
  data: MemePulseResponse | null;
  isStale: boolean;
  isExpired: boolean;
}

export async function getCachedData(cacheKey: string): Promise<CacheResult> {
  const redis = getRedis();
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
          isExpired:
            now >
            expiresAt + MEME_PULSE_CACHE.STALE_TTL_SECONDS * TIME_MS.SECOND,
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

export async function setCachedData(
  cacheKey: string,
  data: MemePulseResponse,
): Promise<void> {
  const redis = getRedis();
  const now = Date.now();
  const staleAt = now + MEME_PULSE_CACHE.TTL_SECONDS * TIME_MS.SECOND;
  const expiresAt = now + MEME_PULSE_CACHE.STALE_TTL_SECONDS * TIME_MS.SECOND;

  if (redis) {
    try {
      await redis.setex(
        cacheKey,
        MEME_PULSE_CACHE.STALE_TTL_SECONDS,
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

// =============================================================================
// YouTube API Fetching
// =============================================================================

interface YouTubeSearchItem {
  id: { videoId: string };
}

interface YouTubeVideoItem {
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
}

export async function fetchFromYouTube(
  district: string,
  sort: 'trending' | 'recent',
): Promise<VideoItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const searchQuery = `${district} ${YOUTUBE_SEARCH_CONFIG.SEARCH_SUFFIX}`;

  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: searchQuery,
    type: 'video',
    maxResults: String(YOUTUBE_QUOTA.MAX_RESULTS),
    regionCode: YOUTUBE_SEARCH_CONFIG.REGION_CODE,
    relevanceLanguage: YOUTUBE_SEARCH_CONFIG.RELEVANCE_LANGUAGE,
    safeSearch: YOUTUBE_SEARCH_CONFIG.SAFE_SEARCH,
    order: sort === 'trending' ? 'viewCount' : 'date',
    key: apiKey,
  });

  // Set date range based on sort type
  const dateRange = new Date();
  if (sort === 'recent') {
    dateRange.setDate(
      dateRange.getDate() - YOUTUBE_SEARCH_CONFIG.RECENT_DAYS_BACK,
    );
  } else {
    dateRange.setMonth(
      dateRange.getMonth() - YOUTUBE_SEARCH_CONFIG.TRENDING_MONTHS_BACK,
    );
  }
  searchParams.set('publishedAfter', dateRange.toISOString());

  // Fetch search results
  const searchResponse = await fetch(
    `${YOUTUBE_API.SEARCH_URL}?${searchParams}`,
  );
  if (!searchResponse.ok) {
    const error = await searchResponse.json();
    throw new Error(error.error?.message || 'YouTube API error');
  }

  await incrementQuota(YOUTUBE_QUOTA.SEARCH_COST);

  const searchData = await searchResponse.json();
  const videoIds = searchData.items
    ?.map((item: YouTubeSearchItem) => item.id.videoId)
    .filter(Boolean)
    .join(',');

  if (!videoIds) {
    return [];
  }

  // Fetch video details
  const videoParams = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: videoIds,
    key: apiKey,
  });

  const videoResponse = await fetch(`${YOUTUBE_API.VIDEOS_URL}?${videoParams}`);
  if (!videoResponse.ok) {
    throw new Error('Failed to fetch video details');
  }

  await incrementQuota(YOUTUBE_QUOTA.VIDEOS_COST);

  const videoData = await videoResponse.json();

  const videos: VideoItem[] = videoData.items
    ?.map((item: YouTubeVideoItem) => ({
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
    }))
    .filter((video: VideoItem) => {
      return !isBlocklisted(video.title) && !isBlocklisted(video.description);
    });

  return videos || [];
}

// =============================================================================
// Response Builders
// =============================================================================

export function buildCacheTtlDate(): string {
  return new Date(
    Date.now() + MEME_PULSE_CACHE.TTL_SECONDS * TIME_MS.SECOND,
  ).toISOString();
}
