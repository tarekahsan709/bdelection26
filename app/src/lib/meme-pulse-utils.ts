/**
 * Meme Pulse Utility Functions
 *
 * Shared utilities for the meme-pulse feature.
 */

import {
  MEME_PULSE_TEXT,
  MEME_PULSE_UI,
  NEWS_CHANNEL_KEYWORDS,
} from '@/constants/meme-pulse';
import { NUMBER_THRESHOLDS } from '@/constants/ui';

// Re-export isMobile from utils for backwards compatibility
export { isMobile as isMobileViewport } from '@/lib/utils';

// =============================================================================
// Time Constants
// =============================================================================

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;

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
  if (views >= NUMBER_THRESHOLDS.CRORE) {
    return `${(views / NUMBER_THRESHOLDS.CRORE).toFixed(1)} ${MEME_PULSE_TEXT.views.crore}`;
  }
  if (views >= NUMBER_THRESHOLDS.LAKH) {
    return `${(views / NUMBER_THRESHOLDS.LAKH).toFixed(1)} ${MEME_PULSE_TEXT.views.lakh}`;
  }
  if (views >= NUMBER_THRESHOLDS.THOUSAND) {
    return `${(views / NUMBER_THRESHOLDS.THOUSAND).toFixed(0)}K`;
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
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffDays === 0) return MEME_PULSE_TEXT.time.today;
  if (diffDays === 1) return MEME_PULSE_TEXT.time.yesterday;
  if (diffDays < DAYS_PER_WEEK) return MEME_PULSE_TEXT.time.daysAgo(diffDays);
  if (diffDays < DAYS_PER_MONTH) {
    return MEME_PULSE_TEXT.time.weeksAgo(Math.floor(diffDays / DAYS_PER_WEEK));
  }
  if (diffDays < DAYS_PER_YEAR) {
    return MEME_PULSE_TEXT.time.monthsAgo(
      Math.floor(diffDays / DAYS_PER_MONTH),
    );
  }
  return MEME_PULSE_TEXT.time.yearsAgo(Math.floor(diffDays / DAYS_PER_YEAR));
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
