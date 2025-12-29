/**
 * Sidebar Utility Functions
 *
 * Shared utilities for sidebar components.
 */

// Re-export formatBengaliNumber from utils for backwards compatibility
export { formatBengaliNumber } from '@/lib/utils';

/**
 * Format voter count with locale string
 */
export function formatVoterCount(count: number): string {
  return count > 0 ? count.toLocaleString('en-US') : '—';
}
