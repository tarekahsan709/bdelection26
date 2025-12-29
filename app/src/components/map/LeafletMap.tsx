'use client';

import L from 'leaflet';
import { useCallback, useEffect, useRef, useState } from 'react';

import 'leaflet/dist/leaflet.css';

import {
  DATA_PATHS,
  GESTURE_HINT,
  MAP_ANIMATION,
  MAP_BOUNDS,
  MAP_CENTER,
  MAP_ZOOM,
  MOBILE_BREAKPOINT,
  TILE_LAYER,
} from '@/constants/map';

import ColorModeToggle from './ColorModeToggle';
import ConstituencyBoundaryLayer from './ConstituencyBoundaryLayer';
import ConstituencyLayer from './ConstituencyLayer';
import DistrictBoundaryLayer from './DistrictBoundaryLayer';
import DivisionBoundaryLayer from './DivisionBoundaryLayer';
import DotLayer, { type ColorMode } from './DotLayer';
import FloatingConstituencyCard from './FloatingConstituencyCard';
import { useMapData } from './hooks/useMapData';
import { useViewportFilter } from './hooks/useViewportFilter';
import QuickStats from './QuickStats';
import SearchBar from './SearchBar';

import type { ConstituencyInfo } from '@/types/constituency';
import type { FilterState, MapState } from '@/types/map';

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
    zoom: MAP_ZOOM.default,
    center: [MAP_CENTER.lat, MAP_CENTER.lng],
    bounds: null,
  });
  const [hoveredConstituency, setHoveredConstituency] =
    useState<ConstituencyInfo | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>('area');
  const [showGestureHint, setShowGestureHint] = useState(false);
  const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHintTimeRef = useRef(0);

  const { dots, loading, error } = useMapData('voters');
  const visibleDots = useViewportFilter(dots, mapState.bounds, mapState.zoom);

  const handleConstituencySelect = useCallback(
    (constituency: ConstituencyInfo | null) => {
      onConstituencySelect?.(constituency);
    },
    [onConstituencySelect],
  );

  const handleConstituencyHover = useCallback(
    (constituency: ConstituencyInfo | null) => {
      setHoveredConstituency(constituency);
    },
    [],
  );

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapRef.current) return;

    const existingMap = (container as HTMLDivElement & { _leaflet_id?: number })
      ._leaflet_id;
    if (existingMap) return;

    let mounted = true;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    const map = L.map(container, {
      center: [MAP_CENTER.lat, MAP_CENTER.lng],
      zoom: MAP_ZOOM.default,
      maxBounds: [
        [MAP_BOUNDS.southWest.lat, MAP_BOUNDS.southWest.lng],
        [MAP_BOUNDS.northEast.lat, MAP_BOUNDS.northEast.lng],
      ],
      maxBoundsViscosity: 1.0,
      minZoom: MAP_ZOOM.min,
      maxZoom: MAP_ZOOM.max,
      preferCanvas: true,
      dragging: !isMobile,
      touchZoom: true,
      scrollWheelZoom: true,
    });

    L.tileLayer(TILE_LAYER.url, {
      attribution: TILE_LAYER.attribution,
      subdomains: TILE_LAYER.subdomains,
    }).addTo(map);

    const updateMapState = () => {
      if (!mounted) return;
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
      mounted = false;
      map.off('moveend', updateMapState);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || window.innerWidth >= MOBILE_BREAKPOINT) return;

    let mounted = true;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastHintTimeRef.current < GESTURE_HINT.cooldownMs) return;
        lastHintTimeRef.current = now;

        if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
        if (mounted) setShowGestureHint(true);
        gestureTimeoutRef.current = setTimeout(() => {
          if (mounted) setShowGestureHint(false);
        }, GESTURE_HINT.displayMs);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    return () => {
      mounted = false;
      container.removeEventListener('touchstart', handleTouchStart);
      if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentFilter = { ...filterState };
    let cancelled = false;

    const fetchAndFlyToRegion = async () => {
      try {
        const response = await fetch(DATA_PATHS.constituencyVoters);
        const data = await response.json();

        if (cancelled) return;

        const constituencies: ConstituencyInfo[] = data.constituencies;

        let filteredConstituencies = constituencies.filter(
          (c) => c.lat && c.long,
        );

        if (currentFilter.divisionId) {
          filteredConstituencies = filteredConstituencies.filter(
            (c) => c.division_id === currentFilter.divisionId,
          );

          if (currentFilter.districtId) {
            filteredConstituencies = filteredConstituencies.filter(
              (c) => c.district_id === currentFilter.districtId,
            );
          }
        }

        if (cancelled) return;

        if (filteredConstituencies.length > 0) {
          const bounds = L.latLngBounds(
            filteredConstituencies.map(
              (c) => [c.lat, c.long] as [number, number],
            ),
          );
          map.flyToBounds(bounds, {
            padding: [MAP_ANIMATION.flyPadding, MAP_ANIMATION.flyPadding],
            maxZoom: currentFilter.districtId
              ? MAP_ZOOM.districtFocus
              : MAP_ZOOM.divisionFocus,
            duration: MAP_ANIMATION.flyDurationSeconds,
          });
        } else if (!currentFilter.divisionId && !currentFilter.districtId) {
          map.flyTo([MAP_CENTER.lat, MAP_CENTER.lng], MAP_ZOOM.default, {
            duration: MAP_ANIMATION.flyDurationSeconds,
          });
        }
      } catch {
        // Silently handle fetch errors
      }
    };

    fetchAndFlyToRegion();

    return () => {
      cancelled = true;
    };
  }, [filterState]);

  if (error) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-gray-900'>
        <p className='text-red-400'>ম্যাপ ডাটা লোড করতে সমস্যা হয়েছে</p>
      </div>
    );
  }

  return (
    <div className='relative h-full w-full isolate'>
      <div ref={mapContainerRef} className='absolute inset-0 z-0' />
      <SearchBar onSelect={handleConstituencySelect} />
      <ColorModeToggle colorMode={colorMode} onChange={setColorMode} />
      <QuickStats />
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
          <DotLayer
            map={mapRef.current}
            dots={visibleDots}
            colorMode={colorMode}
          />
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
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
          <p className='text-white'>ভোটার ডাটা লোড হচ্ছে...</p>
        </div>
      )}
      {showGestureHint && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 z-50 md:hidden'>
          <div className='bg-neutral-900/90 px-4 py-3 rounded-xl text-center'>
            <div className='flex justify-center gap-1 mb-2'>
              <div className='w-4 h-4 rounded-full bg-white/20' />
              <div className='w-4 h-4 rounded-full bg-white/20' />
            </div>
            <p className='text-sm text-white'>দুই আঙুল দিয়ে মানচিত্র সরান</p>
          </div>
        </div>
      )}
    </div>
  );
}
