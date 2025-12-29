'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { BOUNDARY_STYLE, DATA_PATHS } from '@/constants/map';

import type { ConstituencyInfo } from '@/types/constituency';

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

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_PATHS.constituenciesGeoJson, {
          signal: controller.signal,
        });
        const data = await response.json();
        setGeoData(data);
      } catch {
        // Silently handle fetch errors
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!geoData) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const activeConstituency = hoveredConstituency || selectedConstituency;
    const activeId = activeConstituency?.id || null;

    const layer = L.geoJSON(geoData as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const featureId = feature?.properties?.id;
        const isActive = activeId && featureId === activeId;
        const isSelected = selectedConstituency?.id === featureId;

        if (isSelected) {
          return {
            fillColor: BOUNDARY_STYLE.selected.fillColor,
            fillOpacity: BOUNDARY_STYLE.selected.fillOpacity,
            color: BOUNDARY_STYLE.selected.color,
            weight: BOUNDARY_STYLE.selected.weight,
            opacity: 1,
          };
        }

        if (isActive) {
          return {
            fillColor: BOUNDARY_STYLE.hovered.fillColor,
            fillOpacity: BOUNDARY_STYLE.hovered.fillOpacity,
            color: BOUNDARY_STYLE.hovered.color,
            weight: BOUNDARY_STYLE.hovered.weight,
            opacity: 1,
          };
        }

        return {
          fillColor: BOUNDARY_STYLE.inactive.fillColor,
          fillOpacity: BOUNDARY_STYLE.inactive.fillOpacity,
          color: BOUNDARY_STYLE.inactive.color,
          weight: BOUNDARY_STYLE.inactive.weight,
          opacity: BOUNDARY_STYLE.inactive.opacity,
        };
      },
      interactive: false,
    });

    layer.addTo(map);
    layer.bringToBack();
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, geoData, hoveredConstituency, selectedConstituency]);

  return null;
}
