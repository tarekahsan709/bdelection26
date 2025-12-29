import { SAMPLE_RATE_BY_ZOOM, ZOOM_RADIUS } from '@/constants/map';
import { NUMBER_SUFFIXES, NUMBER_THRESHOLDS } from '@/constants/ui';

import type { Dot } from '@/types/dot-density';

// Re-export isMobile from utils for backwards compatibility
export { isMobile } from '@/lib/utils';

export function getConstituencyRadius(zoom: number): number {
  if (zoom <= 6) return ZOOM_RADIUS.constituency[6];
  if (zoom >= 12) return ZOOM_RADIUS.constituency[12];
  return (
    ZOOM_RADIUS.constituency[zoom as keyof typeof ZOOM_RADIUS.constituency] ??
    ZOOM_RADIUS.constituency[7]
  );
}

export function getDotRadius(zoom: number): number {
  if (zoom <= 6) return ZOOM_RADIUS.dot[6];
  if (zoom >= 13) return ZOOM_RADIUS.dot[13];
  return (
    ZOOM_RADIUS.dot[zoom as keyof typeof ZOOM_RADIUS.dot] ?? ZOOM_RADIUS.dot[7]
  );
}

export function getDotGlowRadius(zoom: number): number {
  if (zoom <= 6) return ZOOM_RADIUS.dotGlow[6];
  if (zoom >= 13) return ZOOM_RADIUS.dotGlow[13];
  return (
    ZOOM_RADIUS.dotGlow[zoom as keyof typeof ZOOM_RADIUS.dotGlow] ??
    ZOOM_RADIUS.dotGlow[7]
  );
}

export function getSampleRate(zoom: number): number {
  if (zoom <= 6) return SAMPLE_RATE_BY_ZOOM[6];
  if (zoom >= 12) return SAMPLE_RATE_BY_ZOOM[12];
  return SAMPLE_RATE_BY_ZOOM[zoom] ?? SAMPLE_RATE_BY_ZOOM[7];
}

export function shouldIncludeDot(dot: Dot, sampleRate: number): boolean {
  if (sampleRate >= 1.0) return true;
  const hash = (dot.lat * 1000 + dot.lng * 1000) % 1;
  return hash < sampleRate;
}

export function formatVoterCount(num: number): string {
  if (num >= NUMBER_THRESHOLDS.CRORE) {
    return `${(num / NUMBER_THRESHOLDS.CRORE).toFixed(1)} ${NUMBER_SUFFIXES.crore}`;
  }
  if (num >= NUMBER_THRESHOLDS.LAKH) {
    return `${(num / NUMBER_THRESHOLDS.LAKH).toFixed(1)} ${NUMBER_SUFFIXES.lakh}`;
  }
  return num.toLocaleString('en-US');
}

export function formatLakhCount(num: number): string {
  if (num >= NUMBER_THRESHOLDS.LAKH) {
    return `${(num / NUMBER_THRESHOLDS.LAKH).toFixed(1)} ${NUMBER_SUFFIXES.lakh}`;
  }
  return num.toLocaleString('en-US');
}
