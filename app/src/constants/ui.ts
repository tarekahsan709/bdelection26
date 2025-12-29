/**
 * Shared UI Constants
 *
 * Common configuration values used across multiple features.
 */

// =============================================================================
// Breakpoints
// =============================================================================

/** Mobile breakpoint in pixels (matches Tailwind md breakpoint) */
export const MOBILE_BREAKPOINT = 768;

// =============================================================================
// Bengali Number Formatting Thresholds
// =============================================================================

export const NUMBER_THRESHOLDS = {
  /** 1 Crore (10 million) */
  CRORE: 10000000,

  /** 1 Lakh (100 thousand) */
  LAKH: 100000,

  /** 1 Thousand */
  THOUSAND: 1000,
} as const;

// =============================================================================
// Bengali Number Suffixes
// =============================================================================

export const NUMBER_SUFFIXES = {
  crore: 'কোটি',
  lakh: 'লক্ষ',
  thousand: 'হাজার',
} as const;
