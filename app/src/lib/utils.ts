import {
  MOBILE_BREAKPOINT,
  NUMBER_SUFFIXES,
  NUMBER_THRESHOLDS,
} from '@/constants/ui';

// =============================================================================
// Bengali Number Formatting
// =============================================================================

/**
 * Format number in Bengali style (কোটি, লক্ষ, হাজার)
 * @example formatBengaliNumber(15000000) => "1.5 কোটি"
 * @example formatBengaliNumber(250000) => "2.5 লক্ষ"
 * @example formatBengaliNumber(5000) => "5 হাজার"
 */
export function formatBengaliNumber(num: number): string {
  if (num >= NUMBER_THRESHOLDS.CRORE) {
    return `${(num / NUMBER_THRESHOLDS.CRORE).toFixed(1)} ${NUMBER_SUFFIXES.crore}`;
  }
  if (num >= NUMBER_THRESHOLDS.LAKH) {
    return `${(num / NUMBER_THRESHOLDS.LAKH).toFixed(1)} ${NUMBER_SUFFIXES.lakh}`;
  }
  if (num >= NUMBER_THRESHOLDS.THOUSAND) {
    return `${(num / NUMBER_THRESHOLDS.THOUSAND).toFixed(0)} ${NUMBER_SUFFIXES.thousand}`;
  }
  return num.toLocaleString('en-US');
}

/** @deprecated Use formatBengaliNumber instead */
export const formatNumberBn = formatBengaliNumber;

// =============================================================================
// Mobile Detection
// =============================================================================

/**
 * Check if current viewport is mobile size
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}
