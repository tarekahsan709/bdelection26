'use client';

import type { LatLngBounds } from 'leaflet';
import { useMemo } from 'react';

import { getSampleRate, shouldIncludeDot } from '@/lib/map-utils';

import { MAP_ZOOM } from '@/constants/map';

import type { Dot } from '@/types/dot-density';

export function useViewportFilter(
  dots: Dot[],
  bounds: LatLngBounds | null,
  zoom: number = MAP_ZOOM.default,
) {
  return useMemo(() => {
    const sampleRate = getSampleRate(zoom);

    if (!bounds) {
      return dots.filter((dot) => shouldIncludeDot(dot, sampleRate));
    }

    return dots.filter((dot) => {
      if (!bounds.contains([dot.lat, dot.lng])) return false;
      return shouldIncludeDot(dot, sampleRate);
    });
  }, [dots, bounds, zoom]);
}
