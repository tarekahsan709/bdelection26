'use client';

import { slugify } from '@/lib/url-utils';
import type L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

interface Constituency {
  division_english: string;
  lat: number;
  long: number;
}

interface DivisionMapProps {
  divisionSlug: string;
  className?: string;
}

export default function DivisionMap({ divisionSlug, className = '' }: DivisionMapProps) {
  const mapRef = useRef<unknown>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initMap = async () => {
      try {
        // Dynamic import Leaflet to avoid SSR issues
        const L = await import('leaflet');

        // Fetch constituencies to get division bounds
        const res = await fetch('/data/constituency-voters-2025.json');
        const data = await res.json();
        const constituencies: Constituency[] = data.constituencies.filter(
          (c: Constituency) => slugify(c.division_english) === divisionSlug && c.lat && c.long
        );

        if (constituencies.length === 0) {
          setLoading(false);
          return;
        }

        // Calculate bounds
        const bounds = L.latLngBounds(
          constituencies.map((c) => [c.lat, c.long] as [number, number])
        );

        // Initialize map
        const map = L.map(mapContainerRef.current!, {
          center: bounds.getCenter(),
          zoom: 8,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
        });

        // Use OpenStreetMap standard tiles (light mode with Bangla labels)
        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { subdomains: 'abc' }
        ).addTo(map);

        // Fit to bounds with padding and ensure good zoom level
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 });

        mapRef.current = map;
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        (mapRef.current as L.Map).remove();
        mapRef.current = null;
      }
    };
  }, [divisionSlug]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="absolute inset-0 rounded-2xl overflow-hidden" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 rounded-2xl">
          <div className="w-8 h-8 border-3 border-teal-600/30 border-t-teal-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
