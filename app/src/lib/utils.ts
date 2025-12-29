import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format number in Bengali style (কোটি, লক্ষ, হাজার) */
export function formatNumberBn(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} কোটি`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} লক্ষ`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} হাজার`;
  return num.toString();
}
