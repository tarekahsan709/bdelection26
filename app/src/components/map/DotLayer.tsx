'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { DATA_COLORS } from '@/constants/colors';

import { getPartyColor, usePartyData } from './hooks/usePartyData';

import type { Dot } from '@/types/dot-density';

export type ColorMode = 'area' | 'party';

interface DotLayerProps {
  map: L.Map;
  dots: Dot[];
  colorMode?: ColorMode;
}

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

export default function DotLayer({
  map,
  dots,
  colorMode = 'area',
}: DotLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const glowLayerRef = useRef<L.LayerGroup | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { partyMap, loading: partyLoading } = usePartyData();

  useEffect(() => {
    const checkReady = () => {
      if (map.getZoom() !== undefined && map.getCenter()) {
        setIsReady(true);
      }
    };

    checkReady();
    map.once('load', checkReady);

    return () => {
      map.off('load', checkReady);
    };
  }, [map]);

  useEffect(() => {
    if (!isReady || dots.length === 0) return;
    if (colorMode === 'party' && partyLoading) return;

    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }
    if (glowLayerRef.current) {
      map.removeLayer(glowLayerRef.current);
    }

    const showGlow = !isMobile();
    const glowLayer = showGlow ? L.layerGroup() : null;
    const mainLayer = L.layerGroup();
    const canvasRenderer = L.canvas({ padding: 0.5 });
    const glowRenderer = showGlow ? L.canvas({ padding: 0.5 }) : null;

    const zoom = map.getZoom();
    const baseRadius = getRadiusForZoom(zoom);
    const glowRadius = getGlowRadiusForZoom(zoom);

    dots.forEach((dot: Dot) => {
      let color: string;
      if (colorMode === 'party') {
        color = getPartyColor(partyMap, dot.c_id);
      } else {
        color = dot.u ? DATA_COLORS.urban : DATA_COLORS.rural;
      }

      if (showGlow && glowLayer && glowRenderer) {
        L.circleMarker([dot.lat, dot.lng], {
          renderer: glowRenderer,
          radius: glowRadius,
          fillColor: color,
          fillOpacity: 0.12,
          color: 'transparent',
          weight: 0,
          interactive: false,
        }).addTo(glowLayer);
      }

      L.circleMarker([dot.lat, dot.lng], {
        renderer: canvasRenderer,
        radius: baseRadius,
        fillColor: color,
        fillOpacity: 0.85,
        color: color,
        weight: 0,
        interactive: false,
      }).addTo(mainLayer);
    });

    if (glowLayer) {
      glowLayer.addTo(map);
      glowLayerRef.current = glowLayer;
    }
    mainLayer.addTo(map);
    layerGroupRef.current = mainLayer;

    const handleZoom = () => {
      const newRadius = getRadiusForZoom(map.getZoom());
      const newGlowRadius = getGlowRadiusForZoom(map.getZoom());

      mainLayer.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          layer.setRadius(newRadius);
        }
      });

      if (glowLayer) {
        glowLayer.eachLayer((layer) => {
          if (layer instanceof L.CircleMarker) {
            layer.setRadius(newGlowRadius);
          }
        });
      }
    };

    map.on('zoomend', handleZoom);

    return () => {
      map.off('zoomend', handleZoom);
      if (layerGroupRef.current) {
        map.removeLayer(layerGroupRef.current);
      }
      if (glowLayerRef.current) {
        map.removeLayer(glowLayerRef.current);
      }
    };
  }, [map, dots, isReady, colorMode, partyMap, partyLoading]);

  return null;
}

function getRadiusForZoom(zoom: number): number {
  if (zoom <= 6) return 0.8;
  if (zoom === 7) return 1.0;
  if (zoom === 8) return 1.3;
  if (zoom === 9) return 1.6;
  if (zoom === 10) return 2.0;
  if (zoom === 11) return 2.5;
  if (zoom === 12) return 3.0;
  return 3.5;
}

function getGlowRadiusForZoom(zoom: number): number {
  if (zoom <= 6) return 2.0;
  if (zoom === 7) return 2.5;
  if (zoom === 8) return 3.0;
  if (zoom === 9) return 3.5;
  if (zoom === 10) return 4.5;
  if (zoom === 11) return 5.5;
  if (zoom === 12) return 6.5;
  return 7.5;
}
