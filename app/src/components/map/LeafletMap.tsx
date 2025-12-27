'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapData } from './hooks/useMapData';
import { useViewportFilter } from './hooks/useViewportFilter';
import DotLayer from './DotLayer';
import ConstituencyLayer, { type ConstituencyInfo } from './ConstituencyLayer';
import ConstituencyBoundaryLayer from './ConstituencyBoundaryLayer';
import DistrictBoundaryLayer from './DistrictBoundaryLayer';
import type { FilterState, MapState } from '@/types/map';

const BANGLADESH_CENTER: [number, number] = [23.8103, 90.4125];
const BANGLADESH_BOUNDS: L.LatLngBoundsExpression = [
  [20.5, 88.0],
  [26.7, 92.8],
];

interface LeafletMapProps {
  filterState: FilterState;
  onConstituencySelect?: (constituency: ConstituencyInfo | null) => void;
  selectedConstituency?: ConstituencyInfo | null;
}

export default function LeafletMap({
  filterState,
  onConstituencySelect,
  selectedConstituency,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<MapState>({
    zoom: 7,
    center: BANGLADESH_CENTER,
    bounds: null,
  });
  const [hoveredConstituency, setHoveredConstituency] = useState<ConstituencyInfo | null>(null);

  const { dots, loading, error } = useMapData('voters');
  const visibleDots = useViewportFilter(dots, mapState.bounds, mapState.zoom);

  // Stable callback references
  const handleConstituencySelect = useCallback(
    (constituency: ConstituencyInfo | null) => {
      onConstituencySelect?.(constituency);
    },
    [onConstituencySelect]
  );

  const handleConstituencyHover = useCallback(
    (constituency: ConstituencyInfo | null) => {
      setHoveredConstituency(constituency);
    },
    []
  );

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BANGLADESH_CENTER,
      zoom: 7,
      maxBounds: BANGLADESH_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 6,
      maxZoom: 13,
      preferCanvas: true,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
      }
    ).addTo(map);

    const updateMapState = () => {
      setMapState({
        zoom: map.getZoom(),
        center: [map.getCenter().lat, map.getCenter().lng],
        bounds: map.getBounds(),
      });
    };

    map.on('moveend', updateMapState);
    updateMapState();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map view when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const fetchAndFlyToRegion = async () => {
      try {
        const response = await fetch('/data/constituency-population.json');
        const data = await response.json();
        const constituencies: ConstituencyInfo[] = data.constituencies;

        let filteredConstituencies = constituencies.filter(c => c.lat && c.long);

        if (filterState.divisionId) {
          filteredConstituencies = filteredConstituencies.filter(
            c => c.division_id === filterState.divisionId
          );

          if (filterState.districtId) {
            filteredConstituencies = filteredConstituencies.filter(
              c => c.district_id === filterState.districtId
            );
          }
        }

        if (filteredConstituencies.length > 0) {
          const bounds = L.latLngBounds(
            filteredConstituencies.map(c => [c.lat, c.long] as [number, number])
          );
          map.flyToBounds(bounds, {
            padding: [50, 50],
            maxZoom: filterState.districtId ? 9 : 8,
            duration: 1.2,
          });
        } else if (!filterState.divisionId && !filterState.districtId) {
          map.flyTo(BANGLADESH_CENTER, 7, { duration: 1.2 });
        }
      } catch {
        // Error handled silently
      }
    };

    fetchAndFlyToRegion();
  }, [filterState]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900">
        <p className="text-red-400">Error loading map data: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="absolute inset-0" />
      {mapRef.current && !loading && mapState.bounds && (
        <>
          <ConstituencyBoundaryLayer
            map={mapRef.current}
            hoveredConstituency={hoveredConstituency}
            selectedConstituency={selectedConstituency || null}
          />
          <DotLayer map={mapRef.current} dots={visibleDots} />
          <DistrictBoundaryLayer
            map={mapRef.current}
            hoveredConstituency={hoveredConstituency}
            selectedConstituency={selectedConstituency || null}
          />
          <ConstituencyLayer
            map={mapRef.current}
            onConstituencySelect={handleConstituencySelect}
            onConstituencyHover={handleConstituencyHover}
            selectedConstituency={selectedConstituency || null}
          />
        </>
      )}
      {loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <p className="text-white">Loading voter data...</p>
        </div>
      )}
    </div>
  );
}
