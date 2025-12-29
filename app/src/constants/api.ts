/**
 * API Constants - Centralized configuration for all API routes
 */

import type { IssueVotes } from '@/types/janatar-dabi';

// =============================================================================
// Janatar Dabi (People's Voice)
// =============================================================================

export const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const JANATAR_DABI_RATE_LIMIT = {
  WINDOW_SECONDS: 60,
  MAX_REQUESTS: 10,
} as const;

export const JANATAR_DABI_KEYS = {
  VOTES: 'janatar_dabi:votes:',
  RATE_LIMIT: 'janatar_dabi:ratelimit:',
} as const;

export const DEFAULT_ISSUE_VOTES: IssueVotes = {
  mosquitos: 0,
  water_logging: 0,
  traffic: 0,
  extortion: 0,
  bad_roads: 0,
  load_shedding: 0,
} as const;

export const VALID_ISSUES = [
  'mosquitos',
  'water_logging',
  'traffic',
  'extortion',
  'bad_roads',
  'load_shedding',
] as const;

// =============================================================================
// Meme Pulse (YouTube Videos)
// =============================================================================

export const YOUTUBE_API = {
  SEARCH_URL: 'https://www.googleapis.com/youtube/v3/search',
  VIDEOS_URL: 'https://www.googleapis.com/youtube/v3/videos',
} as const;

export const MEME_PULSE_KEYS = {
  CACHE: 'meme_pulse:',
  QUOTA: 'meme_pulse:quota',
} as const;

export const MEME_PULSE_CACHE = {
  TTL_SECONDS: 24 * 60 * 60, // 24 hours
  STALE_TTL_SECONDS: 7 * 24 * 60 * 60, // 7 days
} as const;

export const YOUTUBE_QUOTA = {
  DAILY_LIMIT: 8000, // Buffer from 10k API limit
  SEARCH_COST: 100,
  VIDEOS_COST: 1,
  MAX_RESULTS: 6,
} as const;

export const YOUTUBE_SEARCH_CONFIG = {
  REGION_CODE: 'BD',
  RELEVANCE_LANGUAGE: 'bn',
  SAFE_SEARCH: 'strict',
  TRENDING_MONTHS_BACK: 2,
  RECENT_DAYS_BACK: 15,
  SEARCH_SUFFIX: 'বাংলাদেশ নির্বাচন',
} as const;

// =============================================================================
// Data API
// =============================================================================

export const ALLOWED_DATA_FILES = new Set([
  'bd-districts.json',
  'bd-divisions.json',
  'bnp_candidates.json',
  'constituencies.geojson',
  'constituency-infrastructure.json',
  'constituency-voters-2025.json',
  'district-boundaries.json',
  'dot-density-population.json',
  'dot-density-voters.json',
  'jamat_candidate.json',
  'juib_candidates.json',
  'ncp_candidates.json',
]) as ReadonlySet<string>;

export const DATA_CONTENT_TYPES = {
  GEOJSON: 'application/geo+json',
  JSON: 'application/json',
} as const;

export const DATA_CACHE_CONTROL =
  'public, max-age=3600, stale-while-revalidate=86400';

// =============================================================================
// Shared
// =============================================================================

export const REDIS_CONFIG = {
  MAX_RETRIES: 3,
  MIN_RETRY_DELAY_MS: 100,
  MAX_RETRY_DELAY_MS: 2000,
} as const;

export const CONSTITUENCY_VALIDATION = {
  MIN_ID: 1,
  MAX_ID: 300,
  PATTERN: /^[1-9][0-9]{0,2}$/,
  ERROR_MESSAGE: 'Constituency ID must be between 1 and 300',
} as const;

export const TIME_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;
