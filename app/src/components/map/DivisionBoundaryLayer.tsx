'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
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

// Map modern division names to old GeoJSON division names
const DIVISION_NAME_MAP: Record<string, string> = {
  'barishal': 'barisal',
  'chattogram': 'chittagong',
  'dhaka': 'dhaka',
  'khulna': 'khulna',
  'rajshahi': 'rajshahi',
  'rangpur': 'rajshahi', // Rangpur districts are in old Rajshahi division
  'sylhet': 'sylhet',
  'mymensingh': 'dhaka', // Mymensingh districts are in old Dhaka division
};

// Old GeoJSON district names that belong to MODERN Rangpur division
// (these were carved out from old Rajshahi division)
const RANGPUR_GEO_DISTRICTS = ['ranpur', 'dinajpur'];

// Old GeoJSON district names that belong to MODERN Mymensingh division
// (these were carved out from old Dhaka division)
const MYMENSINGH_GEO_DISTRICTS = ['mymensingh', 'jamalpur'];

export default function DivisionBoundaryLayer({
  map,
  filterState,
}: DivisionBoundaryLayerProps) {
  const layerRef = useRef<L.GeoJSON | null>(null);
  const [geoData, setGeoData] = useState<DistrictGeoJSON | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtRes, divisionRes] = await Promise.all([
          fetch('/data/district-boundaries.json'),
          fetch('/data/bd-divisions.json'),
        ]);
        const districtData = await districtRes.json();
        const divisionData = await divisionRes.json();
        setGeoData(districtData);
        setDivisions(divisionData.divisions || []);
      } catch (error) {
        console.error('Failed to load boundary data:', error);
      }
    };
    fetchData();
  }, []);

  // Create the layer
  useEffect(() => {
    if (!geoData || !divisions.length) return;

    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // Find selected division name
    let selectedDivisionName: string | null = null;
    if (filterState.divisionId) {
      const division = divisions.find(d => d.id === filterState.divisionId);
      if (division) {
        selectedDivisionName = division.name.toLowerCase();
      }
    }

    // Create the GeoJSON layer
    const layer = L.geoJSON(geoData as GeoJSON.FeatureCollection, {
      style: (feature) => {
        if (!selectedDivisionName) {
          return {
            fillColor: 'transparent',
            fillOpacity: 0,
            color: 'transparent',
            weight: 0,
            opacity: 0,
          };
        }

        const featureDivision = (feature?.properties?.division || '').toLowerCase();
        const districtName = (feature?.properties?.name_lower || '').toLowerCase();

        // Check if this district belongs to the selected division
        let isInSelectedDivision = false;

        // Handle Rangpur (newer division - show only ranpur and dinajpur from old Rajshahi)
        if (selectedDivisionName === 'rangpur') {
          isInSelectedDivision = RANGPUR_GEO_DISTRICTS.includes(districtName);
        }
        // Handle Mymensingh (newer division - show only mymensingh and jamalpur from old Dhaka)
        else if (selectedDivisionName === 'mymensingh') {
          isInSelectedDivision = MYMENSINGH_GEO_DISTRICTS.includes(districtName);
        }
        // Handle Dhaka - show all old Dhaka districts EXCEPT Mymensingh ones
        else if (selectedDivisionName === 'dhaka') {
          isInSelectedDivision = featureDivision === 'dhaka' &&
            !MYMENSINGH_GEO_DISTRICTS.includes(districtName);
        }
        // Handle Rajshahi - show all old Rajshahi districts EXCEPT Rangpur ones
        else if (selectedDivisionName === 'rajshahi') {
          isInSelectedDivision = featureDivision === 'rajshahi' &&
            !RANGPUR_GEO_DISTRICTS.includes(districtName);
        }
        // Handle other divisions (Barishal, Chattogram, Khulna, Sylhet) - direct mapping
        else {
          const mappedDivision = DIVISION_NAME_MAP[selectedDivisionName] || selectedDivisionName;
          isInSelectedDivision = featureDivision === mappedDivision;
        }

        if (isInSelectedDivision) {
          return {
            fillColor: '#0d9488',
            fillOpacity: 0.08,
            color: '#14b8a6',
            weight: 2,
            opacity: 0.6,
          };
        }

        return {
          fillColor: 'transparent',
          fillOpacity: 0,
          color: 'transparent',
          weight: 0,
          opacity: 0,
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
  }, [map, geoData, divisions, filterState]);

  return null;
}
