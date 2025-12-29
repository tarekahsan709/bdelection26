/**
 * Meme Pulse Utility Functions
 *
 * Shared utilities for the meme-pulse feature.
 */

import {
  MEME_PULSE_TEXT,
  MEME_PULSE_UI,
  NEWS_CHANNEL_KEYWORDS,
  VIEW_COUNT_THRESHOLDS,
} from '@/constants/meme-pulse';

// =============================================================================
// Formatting Functions
// =============================================================================

/**
 * Format view count to readable format (Bengali number notation)
 * @example formatViews(15000000) => "1.5 কোটি"
 * @example formatViews(250000) => "2.5 লক্ষ"
 * @example formatViews(5000) => "5K"
 */
export function formatViews(views: number): string {
  if (views >= VIEW_COUNT_THRESHOLDS.CRORE) {
    return `${(views / VIEW_COUNT_THRESHOLDS.CRORE).toFixed(1)} ${MEME_PULSE_TEXT.views.crore}`;
  }
  if (views >= VIEW_COUNT_THRESHOLDS.LAKH) {
    return `${(views / VIEW_COUNT_THRESHOLDS.LAKH).toFixed(1)} ${MEME_PULSE_TEXT.views.lakh}`;
  }
  if (views >= VIEW_COUNT_THRESHOLDS.THOUSAND) {
    return `${(views / VIEW_COUNT_THRESHOLDS.THOUSAND).toFixed(0)}K`;
  }
  return views.toString();
}

/**
 * Format date to relative time (Bengali)
 * @example formatTimeAgo("2024-01-15") => "3 দিন আগে"
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return MEME_PULSE_TEXT.time.today;
  if (diffDays === 1) return MEME_PULSE_TEXT.time.yesterday;
  if (diffDays < 7) return MEME_PULSE_TEXT.time.daysAgo(diffDays);
  if (diffDays < 30)
    return MEME_PULSE_TEXT.time.weeksAgo(Math.floor(diffDays / 7));
  if (diffDays < 365)
    return MEME_PULSE_TEXT.time.monthsAgo(Math.floor(diffDays / 30));
  return MEME_PULSE_TEXT.time.yearsAgo(Math.floor(diffDays / 365));
}

// =============================================================================
// Detection Functions
// =============================================================================

/**
 * Check if a channel name belongs to a news organization
 */
export function isNewsChannel(channelName: string): boolean {
  return NEWS_CHANNEL_KEYWORDS.some((keyword) =>
    channelName.toLowerCase().includes(keyword.toLowerCase()),
  );
}

/**
 * Check if a video is trending based on view count
 */
export function isTrendingVideo(viewCount: number): boolean {
  return viewCount > MEME_PULSE_UI.TRENDING_THRESHOLD;
}

// =============================================================================
// Mobile Detection
// =============================================================================

/**
 * Check if current viewport is mobile size
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MEME_PULSE_UI.MOBILE_BREAKPOINT;
}
