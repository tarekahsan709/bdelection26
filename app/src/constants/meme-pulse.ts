/**
 * Meme Pulse Constants
 *
 * Centralized configuration for the meme-pulse feature (YouTube video feed).
 */

// =============================================================================
// UI Configuration
// =============================================================================

export const MEME_PULSE_UI = {
  /** Hover delay before showing video embed (ms) */
  HOVER_DELAY_MS: 500,

  /** Horizontal scroll amount (px) */
  SCROLL_AMOUNT: 300,

  /** Buffer for detecting scroll end (px) */
  SCROLL_BUFFER: 10,

  /** Number of skeleton cards to show while loading */
  SKELETON_COUNT: 4,

  /** View count threshold to show "Trending" badge */
  TRENDING_THRESHOLD: 100000,

  /** Card width for horizontal layout (px) */
  CARD_WIDTH: 288, // w-72 = 18rem = 288px
} as const;

// =============================================================================
// News Channel Detection
// =============================================================================

export const NEWS_CHANNEL_KEYWORDS = [
  'TV',
  'News',
  'Jamuna',
  'Somoy',
  'NTV',
  'ATN',
  'Channel 24',
  'RTV',
  'Banglavision',
  'Independent',
  'Ekattor',
  'DBC',
] as const;

// =============================================================================
// Bengali Text Labels
// =============================================================================

export const MEME_PULSE_TEXT = {
  /** Time ago labels */
  time: {
    today: 'আজ',
    yesterday: 'গতকাল',
    daysAgo: (days: number) => `${days} দিন আগে`,
    weeksAgo: (weeks: number) => `${weeks} সপ্তাহ আগে`,
    monthsAgo: (months: number) => `${months} মাস আগে`,
    yearsAgo: (years: number) => `${years} বছর আগে`,
  },

  /** View count labels */
  views: {
    crore: 'কোটি',
    lakh: 'লক্ষ',
    suffix: 'ভিউ',
  },

  /** Badge labels */
  badges: {
    trending: 'ট্রেন্ডিং',
    news: 'News',
    creator: 'Creator',
  },

  /** UI text */
  ui: {
    clickToUnmute: 'ক্লিক করে শব্দ চালু করুন',
    youtube: 'YouTube',
    noVideosFound: 'এই জেলার কোনো ভিডিও পাওয়া যায়নি',
    noVideosFoundEn: 'No videos found for this district',
    apiNotConfigured: 'YouTube API not configured',
    fromYoutube: 'ইউটিউব থেকে • YouTube থেকে স্বয়ংক্রিয়ভাবে সংগৃহীত',
    viewMoreOnYoutube: 'YouTube-এ আরও দেখুন',
    whatsHappening: (district: string) => `${district} জেলায় কী হচ্ছে?`,
    whatsHappeningEn: "What's happening in your district",
    trendingTab: '🔥 ট্রেন্ডিং',
    recentTab: '🕐 সাম্প্রতিক',
  },
} as const;

// =============================================================================
// YouTube URLs
// =============================================================================

export const YOUTUBE_URLS = {
  watch: (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`,
  embed: (videoId: string, options: { autoplay?: boolean; mute?: boolean }) =>
    `https://www.youtube.com/embed/${videoId}?autoplay=${options.autoplay ? 1 : 0}&mute=${options.mute ? 1 : 0}&controls=1&modestbranding=1&rel=0`,
  search: (query: string) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
} as const;
