'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { getDotGlowRadius, getDotRadius, isMobile } from '@/lib/map-utils';

import { DATA_COLORS } from '@/constants/colors';

import { getPartyColor, usePartyData } from './hooks/usePartyData';

import type { Dot } from '@/types/dot-density';

export type ColorMode = 'area' | 'party';

interface DotLayerProps {
  map: L.Map;
  dots: Dot[];
  colorMode?: ColorMode;
}

const DOT_STYLE = {
  main: {
    fillOpacity: 0.85,
    weight: 0,
  },
  glow: {
    fillOpacity: 0.12,
    weight: 0,
  },
} as const;

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
    const baseRadius = getDotRadius(zoom);
    const glowRadius = getDotGlowRadius(zoom);

    dots.forEach((dot: Dot) => {
      const color =
        colorMode === 'party'
          ? getPartyColor(partyMap, dot.c_id)
          : dot.u
            ? DATA_COLORS.urban
            : DATA_COLORS.rural;

      if (showGlow && glowLayer && glowRenderer) {
        L.circleMarker([dot.lat, dot.lng], {
          renderer: glowRenderer,
          radius: glowRadius,
          fillColor: color,
          fillOpacity: DOT_STYLE.glow.fillOpacity,
          color: 'transparent',
          weight: DOT_STYLE.glow.weight,
          interactive: false,
        }).addTo(glowLayer);
      }

      L.circleMarker([dot.lat, dot.lng], {
        renderer: canvasRenderer,
        radius: baseRadius,
        fillColor: color,
        fillOpacity: DOT_STYLE.main.fillOpacity,
        color: color,
        weight: DOT_STYLE.main.weight,
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
      const newRadius = getDotRadius(map.getZoom());
      const newGlowRadius = getDotGlowRadius(map.getZoom());

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
