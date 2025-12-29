'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { DATA_PATHS } from '@/constants/map';

import type { ConstituencyInfo } from '@/types/constituency';
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

const DISTRICT_NAME_MAP: Record<string, string> = {
  barguna: 'barisal',
  barishal: 'barisal',
  barisal: 'barisal',
  bhola: 'barisal',
  jhalokati: 'barisal',
  jhalokathi: 'barisal',
  patuakhali: 'patuakhali',
  pirojpur: 'barisal',
  bandarban: 'bandarban',
  brahmanbaria: 'comilla',
  chandpur: 'comilla',
  chattogram: 'chittagong',
  chittagong: 'chittagong',
  comilla: 'comilla',
  cumilla: 'comilla',
  "cox's bazar": 'chittagong',
  'coxs bazar': 'chittagong',
  feni: 'noakhali',
  khagrachhari: 'khagrachari',
  khagrachari: 'khagrachari',
  lakshmipur: 'noakhali',
  noakhali: 'noakhali',
  rangamati: 'rangamati',
  dhaka: 'dhaka',
  faridpur: 'faridpur',
  gazipur: 'dhaka',
  gopalganj: 'faridpur',
  kishoreganj: 'kishoreganj',
  madaripur: 'faridpur',
  manikganj: 'dhaka',
  munshiganj: 'dhaka',
  narayanganj: 'dhaka',
  narsingdi: 'dhaka',
  rajbari: 'faridpur',
  shariatpur: 'faridpur',
  tangail: 'tangali',
  bagerhat: 'khulna',
  chuadanga: 'kushtia',
  jessore: 'jessore',
  jashore: 'jessore',
  jhenaidah: 'jessore',
  jhenaidha: 'jessore',
  khulna: 'khulna',
  kushtia: 'kushtia',
  magura: 'jessore',
  meherpur: 'kushtia',
  narail: 'jessore',
  satkhira: 'khulna',
  jamalpur: 'jamalpur',
  mymensingh: 'mymensingh',
  netrokona: 'mymensingh',
  sherpur: 'jamalpur',
  bogra: 'bogra',
  bogura: 'bogra',
  chapainawabganj: 'rajshahi',
  joypurhat: 'bogra',
  naogaon: 'rajshahi',
  natore: 'rajshahi',
  nawabganj: 'rajshahi',
  pabna: 'pabna',
  rajshahi: 'rajshahi',
  sirajganj: 'pabna',
  dinajpur: 'dinajpur',
  gaibandha: 'ranpur',
  kurigram: 'ranpur',
  lalmonirhat: 'ranpur',
  nilphamari: 'dinajpur',
  panchagarh: 'dinajpur',
  rangpur: 'ranpur',
  thakurgaon: 'dinajpur',
  habiganj: 'sylhet',
  moulvibazar: 'sylhet',
  sunamganj: 'sylhet',
  sylhet: 'sylhet',
};

const DISTRICT_STYLE = {
  active: {
    fillColor: 'transparent',
    fillOpacity: 0.1,
    color: '#ffffff',
    weight: 3,
    opacity: 1,
  },
  inactive: {
    fillColor: 'transparent',
    fillOpacity: 0,
    color: 'transparent',
    weight: 0,
    opacity: 1,
  },
} as const;

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
          fetch(DATA_PATHS.districtBoundaries, { signal: controller.signal }),
          fetch(DATA_PATHS.districts, { signal: controller.signal }),
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

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const activeConstituency = hoveredConstituency || selectedConstituency;
    let activeDistrictName: string | null = null;

    if (activeConstituency) {
      const districtEnglish =
        activeConstituency.district_english?.toLowerCase() || '';
      activeDistrictName = DISTRICT_NAME_MAP[districtEnglish] || null;
    } else if (filterState?.districtId && districts.length > 0) {
      const district = districts.find((d) => d.id === filterState.districtId);
      if (district) {
        const districtName = district.name.toLowerCase();
        activeDistrictName = DISTRICT_NAME_MAP[districtName] || null;
      }
    }

    const layer = L.geoJSON(geoData as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const featureName = feature?.properties?.name_lower || '';
        const isActive =
          activeDistrictName && featureName === activeDistrictName;

        return isActive ? DISTRICT_STYLE.active : DISTRICT_STYLE.inactive;
      },
      interactive: false,
    });

    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [
    map,
    geoData,
    districts,
    hoveredConstituency,
    selectedConstituency,
    filterState,
  ]);

  return null;
}
