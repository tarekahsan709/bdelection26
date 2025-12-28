'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { ConstituencyInfo } from './ConstituencyLayer';
import type { FilterState } from '@/types/map';

interface District {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
}

interface DistrictBoundaryLayerProps {
  map: L.Map;
  hoveredConstituency: ConstituencyInfo | null;
  selectedConstituency: ConstituencyInfo | null;
  filterState?: FilterState;
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

// Map modern district names to old GeoJSON district names
const DISTRICT_NAME_MAP: Record<string, string> = {
  // Barisal division
  'barguna': 'barisal',
  'barishal': 'barisal',
  'barisal': 'barisal',
  'bhola': 'barisal',
  'jhalokati': 'barisal',
  'jhalokathi': 'barisal',
  'patuakhali': 'patuakhali',
  'pirojpur': 'barisal',

  // Chattogram division
  'bandarban': 'bandarban',
  'brahmanbaria': 'comilla',
  'chandpur': 'comilla',
  'chattogram': 'chittagong',
  'chittagong': 'chittagong',
  'comilla': 'comilla',
  'cumilla': 'comilla',
  "cox's bazar": 'chittagong',
  'coxs bazar': 'chittagong',
  'feni': 'noakhali',
  'khagrachhari': 'khagrachari',
  'khagrachari': 'khagrachari',
  'lakshmipur': 'noakhali',
  'noakhali': 'noakhali',
  'rangamati': 'rangamati',

  // Dhaka division
  'dhaka': 'dhaka',
  'faridpur': 'faridpur',
  'gazipur': 'dhaka',
  'gopalganj': 'faridpur',
  'kishoreganj': 'kishoreganj',
  'madaripur': 'faridpur',
  'manikganj': 'dhaka',
  'munshiganj': 'dhaka',
  'narayanganj': 'dhaka',
  'narsingdi': 'dhaka',
  'rajbari': 'faridpur',
  'shariatpur': 'faridpur',
  'tangail': 'tangali',

  // Khulna division
  'bagerhat': 'khulna',
  'chuadanga': 'kushtia',
  'jessore': 'jessore',
  'jashore': 'jessore',
  'jhenaidah': 'jessore',
  'jhenaidha': 'jessore',
  'khulna': 'khulna',
  'kushtia': 'kushtia',
  'magura': 'jessore',
  'meherpur': 'kushtia',
  'narail': 'jessore',
  'satkhira': 'khulna',

  // Mymensingh division
  'jamalpur': 'jamalpur',
  'mymensingh': 'mymensingh',
  'netrokona': 'mymensingh',
  'sherpur': 'jamalpur',

  // Rajshahi division
  'bogra': 'bogra',
  'bogura': 'bogra',
  'chapainawabganj': 'rajshahi',
  'joypurhat': 'bogra',
  'naogaon': 'rajshahi',
  'natore': 'rajshahi',
  'nawabganj': 'rajshahi',
  'pabna': 'pabna',
  'rajshahi': 'rajshahi',
  'sirajganj': 'pabna',

  // Rangpur division
  'dinajpur': 'dinajpur',
  'gaibandha': 'ranpur',
  'kurigram': 'ranpur',
  'lalmonirhat': 'ranpur',
  'nilphamari': 'dinajpur',
  'panchagarh': 'dinajpur',
  'rangpur': 'ranpur',
  'thakurgaon': 'dinajpur',

  // Sylhet division
  'habiganj': 'sylhet',
  'moulvibazar': 'sylhet',
  'sunamganj': 'sylhet',
  'sylhet': 'sylhet',
};

export default function DistrictBoundaryLayer({
  map,
  hoveredConstituency,
  selectedConstituency,
  filterState,
}: DistrictBoundaryLayerProps) {
  const layerRef = useRef<L.GeoJSON | null>(null);
  const [geoData, setGeoData] = useState<DistrictGeoJSON | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const [boundaryRes, districtRes] = await Promise.all([
          fetch('/data/district-boundaries.json', { signal: controller.signal }),
          fetch('/data/bd-districts.json', { signal: controller.signal }),
        ]);
        const boundaryData = await boundaryRes.json();
        const districtData = await districtRes.json();
        setGeoData(boundaryData);
        setDistricts(districtData.districts || []);
      } catch {
        // Silently handle fetch errors
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!geoData) return;

    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // Get the district to highlight - from constituency hover/select or from filter
    const activeConstituency = hoveredConstituency || selectedConstituency;
    let activeDistrictName: string | null = null;

    if (activeConstituency) {
      const districtEnglish = activeConstituency.district_english?.toLowerCase() || '';
      activeDistrictName = DISTRICT_NAME_MAP[districtEnglish] || null;
    } else if (filterState?.districtId && districts.length > 0) {
      // Get district name from filter
      const district = districts.find(d => d.id === filterState.districtId);
      if (district) {
        const districtName = district.name.toLowerCase();
        activeDistrictName = DISTRICT_NAME_MAP[districtName] || null;
      }
    }

    // Create the GeoJSON layer
    const layer = L.geoJSON(geoData as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const featureName = feature?.properties?.name_lower || '';
        const isActive = activeDistrictName && featureName === activeDistrictName;

        return {
          fillColor: 'transparent',
          fillOpacity: isActive ? 0.1 : 0,
          color: isActive ? '#ffffff' : 'transparent',
          weight: isActive ? 3 : 0,
          opacity: 1,
        };
      },
      interactive: false, // Don't block other interactions
    });

    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, geoData, districts, hoveredConstituency, selectedConstituency, filterState]);

  return null;
}
