'use client';

import { useMemo } from 'react';
import type { Dot } from '@/types/dot-density';
import type { LatLngBounds } from 'leaflet';

// Sample rate based on zoom level - very sparse at low zoom
function getSampleRate(zoom: number): number {
  if (zoom <= 6) return 0.08;  // Show 8% of dots
  if (zoom === 7) return 0.12; // Default view - show 12% for very sparse look
  if (zoom === 8) return 0.25; // Show 25%
  if (zoom === 9) return 0.45; // Show 45%
  if (zoom === 10) return 0.65; // Show 65%
  if (zoom === 11) return 0.85; // Show 85%
  return 1.0; // Zoom 12+ show all dots
}

// Deterministic sampling based on dot position (consistent across renders)
function shouldIncludeDot(dot: Dot, sampleRate: number): boolean {
  if (sampleRate >= 1.0) return true;
  // Use a simple hash based on coordinates for deterministic sampling
  const hash = (dot.lat * 1000 + dot.lng * 1000) % 1;
  return hash < sampleRate;
}

export function useViewportFilter(
  dots: Dot[],
  bounds: LatLngBounds | null,
  zoom = 7
) {
  return useMemo(() => {
    const sampleRate = getSampleRate(zoom);

    if (!bounds) {
      // No bounds, just sample
      return dots.filter((dot) => shouldIncludeDot(dot, sampleRate));
    }

    // Filter dots within visible bounds AND apply sampling
    return dots.filter((dot) => {
      if (!bounds.contains([dot.lat, dot.lng])) return false;
      return shouldIncludeDot(dot, sampleRate);
    });
  }, [dots, bounds, zoom]);
}
