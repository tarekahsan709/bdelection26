'use client';

import L from 'leaflet';
import { useCallback, useEffect, useRef, useState } from 'react';

import 'leaflet/dist/leaflet.css';

import ColorModeToggle from './ColorModeToggle';
import ConstituencyBoundaryLayer from './ConstituencyBoundaryLayer';
import ConstituencyLayer, { type ConstituencyInfo } from './ConstituencyLayer';
import DistrictBoundaryLayer from './DistrictBoundaryLayer';
import DivisionBoundaryLayer from './DivisionBoundaryLayer';
import DotLayer, { type ColorMode } from './DotLayer';
import FloatingConstituencyCard from './FloatingConstituencyCard';
import { useMapData } from './hooks/useMapData';
import { useViewportFilter } from './hooks/useViewportFilter';
import QuickStats from './QuickStats';
import SearchBar from './SearchBar';

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
  const [colorMode, setColorMode] = useState<ColorMode>('area');

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

    // Capture current filter state for this effect
    const currentFilter = { ...filterState };
    let cancelled = false;

    const fetchAndFlyToRegion = async () => {
      try {
        const response = await fetch('/data/constituency-voters-2025.json');
        const data = await response.json();

        // Check if filter changed while we were fetching
        if (cancelled) return;

        const constituencies: ConstituencyInfo[] = data.constituencies;

        let filteredConstituencies = constituencies.filter(c => c.lat && c.long);

        if (currentFilter.divisionId) {
          filteredConstituencies = filteredConstituencies.filter(
            c => c.division_id === currentFilter.divisionId
          );

          if (currentFilter.districtId) {
            filteredConstituencies = filteredConstituencies.filter(
              c => c.district_id === currentFilter.districtId
            );
          }
        }

        // Only fly if filter hasn't changed
        if (cancelled) return;

        if (filteredConstituencies.length > 0) {
          const bounds = L.latLngBounds(
            filteredConstituencies.map(c => [c.lat, c.long] as [number, number])
          );
          map.flyToBounds(bounds, {
            padding: [50, 50],
            maxZoom: currentFilter.districtId ? 9 : 8,
            duration: 1.2,
          });
        } else if (!currentFilter.divisionId && !currentFilter.districtId) {
          map.flyTo(BANGLADESH_CENTER, 7, { duration: 1.2 });
        }
      } catch {
        // Error handled silently
      }
    };

    fetchAndFlyToRegion();

    return () => {
      cancelled = true;
    };
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

      {/* Search bar overlay */}
      <SearchBar onSelect={handleConstituencySelect} />

      {/* Color mode toggle */}
      <ColorModeToggle colorMode={colorMode} onChange={setColorMode} />

      {/* Quick stats at bottom */}
      <QuickStats />

      {/* Floating constituency card when selected/hovered */}
      {(selectedConstituency || hoveredConstituency) && (
        <FloatingConstituencyCard
          constituency={selectedConstituency || hoveredConstituency}
          onClose={() => handleConstituencySelect(null)}
          isSelected={!!selectedConstituency}
        />
      )}

      {mapRef.current && !loading && mapState.bounds && (
        <>
          <DivisionBoundaryLayer
            map={mapRef.current}
            filterState={filterState}
          />
          <ConstituencyBoundaryLayer
            map={mapRef.current}
            hoveredConstituency={hoveredConstituency}
            selectedConstituency={selectedConstituency || null}
          />
          <DotLayer map={mapRef.current} dots={visibleDots} colorMode={colorMode} />
          <DistrictBoundaryLayer
            map={mapRef.current}
            hoveredConstituency={hoveredConstituency}
            selectedConstituency={selectedConstituency || null}
            filterState={filterState}
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
