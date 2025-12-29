import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { apiError } from '@/lib/api-utils';

import {
  buildCacheTtlDate,
  checkQuota,
  fetchFromYouTube,
  getCachedData,
  getCacheKey,
  setCachedData,
} from '@/services/youtube';

import type { MemePulseResponse } from '@/types/meme-pulse';

// =============================================================================
// Validation Schema
// =============================================================================

const querySchema = z.object({
  district: z.string().min(1).max(100),
  sort: z.enum(['trending', 'recent']).default('trending'),
});

// =============================================================================
// Route Handler
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const sort = searchParams.get('sort') || 'trending';

  const parseResult = querySchema.safeParse({ district, sort });
  if (!parseResult.success) {
    return apiError('Invalid parameters', { status: 400 });
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

  // Check API availability
  const apiKey = process.env.YOUTUBE_API_KEY;
  const hasQuota = await checkQuota();

  // Return stale cache if quota exceeded or API unavailable
  if (cached && (!hasQuota || !apiKey)) {
    return NextResponse.json({
      ...cached,
      source: 'stale',
      message: !hasQuota
        ? 'API quota exceeded, showing cached data'
        : undefined,
    });
  }

  // No API key configured
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      district: validDistrict,
      videos: [],
      cachedAt: new Date().toISOString(),
      expiresAt: buildCacheTtlDate(),
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
      expiresAt: buildCacheTtlDate(),
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

    return apiError(
      error instanceof Error ? error.message : 'Failed to fetch videos',
    );
  }
}
