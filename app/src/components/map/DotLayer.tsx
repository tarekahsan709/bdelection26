'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dot } from '@/types/dot-density';
import { getConstituencyColor } from '@/constants/divisions';

interface DotLayerProps {
  map: L.Map;
  dots: Dot[];
}

export default function DotLayer({ map, dots }: DotLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Clear existing layer
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }

    const layerGroup = L.layerGroup();
    const canvasRenderer = L.canvas({ padding: 0.5 });

    // Add dots with random multi-color distribution (like UK GE Dot Map)
    dots.forEach((dot: Dot) => {
      const color = getConstituencyColor(dot.c_id);

      L.circleMarker([dot.lat, dot.lng], {
        renderer: canvasRenderer,
        radius: getRadiusForZoom(map.getZoom()),
        fillColor: color,
        fillOpacity: 0.7, // Slightly transparent for overlapping dots
        color: color,
        weight: 0, // No outline for cleaner look
        interactive: false, // Disable for performance
      }).addTo(layerGroup);
    });

    layerGroup.addTo(map);
    layerGroupRef.current = layerGroup;

    // Update dot size on zoom
    const handleZoom = () => {
      const newRadius = getRadiusForZoom(map.getZoom());
      layerGroup.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          layer.setRadius(newRadius);
        }
      });
    };

    map.on('zoomend', handleZoom);

    return () => {
      map.off('zoomend', handleZoom);
      if (layerGroupRef.current) {
        map.removeLayer(layerGroupRef.current);
      }
    };
  }, [map, dots]);

  return null; // This component only manages Leaflet layers
}

// Tiny dots - very sparse at default view
function getRadiusForZoom(zoom: number): number {
  if (zoom <= 6) return 0.3;
  if (zoom === 7) return 0.4;   // Default view - tiny dots
  if (zoom === 8) return 0.6;
  if (zoom === 9) return 0.8;
  if (zoom === 10) return 1.0;
  if (zoom === 11) return 1.3;
  if (zoom === 12) return 1.6;
  return 1.8;
}
