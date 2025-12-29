'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { BOUNDARY_STYLE, DATA_PATHS } from '@/constants/map';

import type { FilterState } from '@/types/map';

interface DivisionBoundaryLayerProps {
  map: L.Map;
  filterState: FilterState;
}

interface Division {
  id: string;
  name: string;
  bn_name: string;
}

interface DistrictFeature {
  type: 'Feature';
  properties: {
    name: string;
    division: string;
    name_lower: string;
  };
  geometry: GeoJSON.Geometry;
}

interface DistrictGeoJSON {
  type: 'FeatureCollection';
  features: DistrictFeature[];
}

const DIVISION_NAME_MAP: Record<string, string> = {
  barishal: 'barisal',
  chattogram: 'chittagong',
  dhaka: 'dhaka',
  khulna: 'khulna',
  rajshahi: 'rajshahi',
  rangpur: 'rajshahi',
  sylhet: 'sylhet',
  mymensingh: 'dhaka',
};

const RANGPUR_GEO_DISTRICTS = ['ranpur', 'dinajpur'];
const MYMENSINGH_GEO_DISTRICTS = ['mymensingh', 'jamalpur'];

function isDistrictInDivision(
  selectedDivisionName: string,
  featureDivision: string,
  districtName: string,
): boolean {
  if (selectedDivisionName === 'rangpur') {
    return RANGPUR_GEO_DISTRICTS.includes(districtName);
  }
  if (selectedDivisionName === 'mymensingh') {
    return MYMENSINGH_GEO_DISTRICTS.includes(districtName);
  }
  if (selectedDivisionName === 'dhaka') {
    return (
      featureDivision === 'dhaka' &&
      !MYMENSINGH_GEO_DISTRICTS.includes(districtName)
    );
  }
  if (selectedDivisionName === 'rajshahi') {
    return (
      featureDivision === 'rajshahi' &&
      !RANGPUR_GEO_DISTRICTS.includes(districtName)
    );
  }

  const mappedDivision =
    DIVISION_NAME_MAP[selectedDivisionName] || selectedDivisionName;
  return featureDivision === mappedDivision;
}

export default function DivisionBoundaryLayer({
  map,
  filterState,
}: DivisionBoundaryLayerProps) {
  const layerRef = useRef<L.GeoJSON | null>(null);
  const [geoData, setGeoData] = useState<DistrictGeoJSON | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const [districtRes, divisionRes] = await Promise.all([
          fetch(DATA_PATHS.districtBoundaries, { signal: controller.signal }),
          fetch(DATA_PATHS.divisions, { signal: controller.signal }),
        ]);
        const districtData = await districtRes.json();
        const divisionData = await divisionRes.json();
        setGeoData(districtData);
        setDivisions(divisionData.divisions || []);
      } catch {
        // Silently handle fetch errors
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!geoData || !divisions.length) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    let selectedDivisionName: string | null = null;
    if (filterState.divisionId) {
      const division = divisions.find((d) => d.id === filterState.divisionId);
      if (division) {
        selectedDivisionName = division.name.toLowerCase();
      }
    }

    const layer = L.geoJSON(geoData as GeoJSON.FeatureCollection, {
      style: (feature) => {
        if (!selectedDivisionName) {
          return BOUNDARY_STYLE.hidden;
        }

        const featureDivision = (
          feature?.properties?.division || ''
        ).toLowerCase();
        const districtName = (
          feature?.properties?.name_lower || ''
        ).toLowerCase();

        const isInSelectedDivision = isDistrictInDivision(
          selectedDivisionName,
          featureDivision,
          districtName,
        );

        if (isInSelectedDivision) {
          return {
            fillColor: BOUNDARY_STYLE.division.fillColor,
            fillOpacity: BOUNDARY_STYLE.division.fillOpacity,
            color: BOUNDARY_STYLE.division.color,
            weight: BOUNDARY_STYLE.division.weight,
            opacity: BOUNDARY_STYLE.division.opacity,
          };
        }

        return BOUNDARY_STYLE.hidden;
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
  }, [map, geoData, divisions, filterState]);

  return null;
}
