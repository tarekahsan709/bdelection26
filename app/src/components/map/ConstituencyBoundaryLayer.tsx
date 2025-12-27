'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { ConstituencyInfo } from './ConstituencyLayer';

interface ConstituencyBoundaryLayerProps {
  map: L.Map;
  hoveredConstituency: ConstituencyInfo | null;
  selectedConstituency: ConstituencyInfo | null;
}

interface ConstituencyFeature {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    name_english: string;
    division_id: string;
    division_english: string;
    district_id: string;
    district_english: string;
    registered_voters: number;
    lat: number;
    long: number;
  };
  geometry: GeoJSON.Geometry;
}

interface ConstituencyGeoJSON {
  type: 'FeatureCollection';
  features: ConstituencyFeature[];
}

export default function ConstituencyBoundaryLayer({
  map,
  hoveredConstituency,
  selectedConstituency,
}: ConstituencyBoundaryLayerProps) {
  const layerRef = useRef<L.GeoJSON | null>(null);
  const [geoData, setGeoData] = useState<ConstituencyGeoJSON | null>(null);

  // Load constituency boundaries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/constituencies.geojson');
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('Failed to load constituency boundaries:', error);
      }
    };
    fetchData();
  }, []);

  // Create the layer
  useEffect(() => {
    if (!geoData) return;

    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // Get the constituency to highlight
    const activeConstituency = hoveredConstituency || selectedConstituency;
    const activeId = activeConstituency?.id || null;

    // Create the GeoJSON layer
    const layer = L.geoJSON(geoData as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const featureId = feature?.properties?.id;
        const isActive = activeId && featureId === activeId;
        const isSelected = selectedConstituency?.id === featureId;

        if (isActive || isSelected) {
          return {
            fillColor: isSelected ? '#0d9488' : '#14b8a6',
            fillOpacity: isSelected ? 0.25 : 0.15,
            color: isSelected ? '#0d9488' : '#14b8a6',
            weight: isSelected ? 3 : 2,
            opacity: 1,
          };
        }

        // Default style - subtle outline only
        return {
          fillColor: 'transparent',
          fillOpacity: 0,
          color: '#374151',
          weight: 0.5,
          opacity: 0.3,
        };
      },
      interactive: false, // Don't block dot layer interactions
    });

    layer.addTo(map);
    layer.bringToBack(); // Ensure it's behind the dots
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, geoData, hoveredConstituency, selectedConstituency]);

  return null;
}
