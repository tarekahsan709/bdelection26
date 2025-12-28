'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { DATA_COLORS } from '@/constants/colors';

import { getPartyColor,usePartyData } from './hooks/usePartyData';

import type { Dot } from '@/types/dot-density';

export type ColorMode = 'area' | 'party';

interface DotLayerProps {
  map: L.Map;
  dots: Dot[];
  colorMode?: ColorMode;
}

export default function DotLayer({ map, dots, colorMode = 'area' }: DotLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const glowLayerRef = useRef<L.LayerGroup | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { partyMap, loading: partyLoading } = usePartyData();

  // Wait for map to be fully initialized before rendering dots
  useEffect(() => {
    const checkReady = () => {
      if (map.getZoom() !== undefined && map.getCenter()) {
        setIsReady(true);
      }
    };

    // Check immediately
    checkReady();

    // Also listen for first load event
    map.once('load', checkReady);

    return () => {
      map.off('load', checkReady);
    };
  }, [map]);

  useEffect(() => {
    if (!isReady || dots.length === 0) return;
    // Wait for party data if in party mode
    if (colorMode === 'party' && partyLoading) return;

    // Clear existing layers
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }
    if (glowLayerRef.current) {
      map.removeLayer(glowLayerRef.current);
    }

    const glowLayer = L.layerGroup();
    const mainLayer = L.layerGroup();
    const canvasRenderer = L.canvas({ padding: 0.5 });
    const glowRenderer = L.canvas({ padding: 0.5 });

    const zoom = map.getZoom();
    const baseRadius = getRadiusForZoom(zoom);
    const glowRadius = getGlowRadiusForZoom(zoom);

    // Add dots with coloring based on mode
    dots.forEach((dot: Dot) => {
      // Get color based on mode
      let color: string;
      if (colorMode === 'party') {
        color = getPartyColor(partyMap, dot.c_id);
      } else {
        // Urban = teal, Rural = amber (Golden Delta theme)
        color = dot.u ? DATA_COLORS.urban : DATA_COLORS.rural;
      }

      // Subtle glow layer (rendered behind main dots)
      L.circleMarker([dot.lat, dot.lng], {
        renderer: glowRenderer,
        radius: glowRadius,
        fillColor: color,
        fillOpacity: 0.12, // Reduced for subtler effect
        color: 'transparent',
        weight: 0,
        interactive: false,
      }).addTo(glowLayer);

      // Main dot layer
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

    // Add glow first (behind), then main dots
    glowLayer.addTo(map);
    mainLayer.addTo(map);
    glowLayerRef.current = glowLayer;
    layerGroupRef.current = mainLayer;

    // Update dot size on zoom
    const handleZoom = () => {
      const newRadius = getRadiusForZoom(map.getZoom());
      const newGlowRadius = getGlowRadiusForZoom(map.getZoom());

      mainLayer.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          layer.setRadius(newRadius);
        }
      });

      glowLayer.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          layer.setRadius(newGlowRadius);
        }
      });
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

  return null; // This component only manages Leaflet layers
}

// Smaller dots for denser visualization (like UK GE Dot Map)
function getRadiusForZoom(zoom: number): number {
  if (zoom <= 6) return 0.8;
  if (zoom === 7) return 1.0;   // Default view - small but visible
  if (zoom === 8) return 1.3;
  if (zoom === 9) return 1.6;
  if (zoom === 10) return 2.0;
  if (zoom === 11) return 2.5;
  if (zoom === 12) return 3.0;
  return 3.5;
}

// Glow radius - slightly larger than main dots
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
