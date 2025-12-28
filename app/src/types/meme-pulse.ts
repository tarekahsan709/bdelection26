// Meme Pulse - "What's happening in your area" video feed types

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  channelName: string;
  channelId: string;
  thumbnailUrl: string;
  thumbnailHigh: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
}

export interface MemePulseResponse {
  success: boolean;
  district: string;
  videos: VideoItem[];
  cachedAt: string;
  expiresAt: string;
  source: 'cache' | 'api';
}

export interface MemePulseError {
  success: false;
  error: string;
}

// Keywords to filter out violent/inappropriate content
export const BLOCKLIST_KEYWORDS = [
  'attack',
  'kill',
  'murder',
  'death',
  'fight',
  'violence',
  'blood',
  'riot',
  'clash',
  'হামলা',
  'হত্যা',
  'মৃত্যু',
  'সংঘর্ষ',
];

// Search query templates
export const SEARCH_TEMPLATES = {
  election: (name: string) => `${name} নির্বাচন 2026`,
  news: (name: string) => `${name} খবর`,
  development: (name: string) => `${name} উন্নয়ন`,
  road: (name: string) => `${name} রাস্তা`,
};
