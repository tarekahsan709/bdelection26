/**
 * Sidebar Utility Functions
 *
 * Shared utilities for sidebar components.
 */

import { NUMBER_THRESHOLDS, SIDEBAR_TEXT } from '@/constants/sidebar';

// =============================================================================
// Number Formatting
// =============================================================================

/**
 * Format number with Bengali suffixes (কোটি, লক্ষ, হাজার)
 * @example formatBengaliNumber(15000000) => "1.5 কোটি"
 * @example formatBengaliNumber(250000) => "2.5 লক্ষ"
 * @example formatBengaliNumber(5000) => "5 হাজার"
 */
export function formatBengaliNumber(num: number): string {
  if (num >= NUMBER_THRESHOLDS.CRORE) {
    return `${(num / NUMBER_THRESHOLDS.CRORE).toFixed(1)} ${SIDEBAR_TEXT.numbers.crore}`;
  }
  if (num >= NUMBER_THRESHOLDS.LAKH) {
    return `${(num / NUMBER_THRESHOLDS.LAKH).toFixed(1)} ${SIDEBAR_TEXT.numbers.lakh}`;
  }
  if (num >= NUMBER_THRESHOLDS.THOUSAND) {
    return `${(num / NUMBER_THRESHOLDS.THOUSAND).toFixed(0)} ${SIDEBAR_TEXT.numbers.thousand}`;
  }
  return num.toLocaleString('en-US');
}

/**
 * Format voter count with locale string
 */
export function formatVoterCount(count: number): string {
  return count > 0 ? count.toLocaleString('en-US') : '—';
}
