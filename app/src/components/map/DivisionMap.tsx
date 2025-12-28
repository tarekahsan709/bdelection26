'use client';

import { getConstituencyUrl, slugify } from '@/lib/url-utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Constituency {
  id: string;
  name: string;
  name_english: string;
  division_english: string;
  district_english: string;
  lat: number;
  long: number;
  registered_voters: number;
  urban_classification: 'urban' | 'rural';
}

interface DivisionMapProps {
  divisionSlug: string;
  className?: string;
}

export default function DivisionMap({ divisionSlug, className = '' }: DivisionMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initMap = async () => {
      try {
        // Fetch constituencies
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
        });

        // Add dark tile layer
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          { subdomains: 'abcd' }
        ).addTo(map);

        // Fit to bounds with padding
        map.fitBounds(bounds, { padding: [30, 30] });

        // Add constituency markers
        constituencies.forEach((c) => {
          const isUrban = c.urban_classification === 'urban';
          const color = isUrban ? '#14b8a6' : '#f59e0b';

          const circle = L.circleMarker([c.lat, c.long], {
            radius: 8,
            fillColor: color,
            fillOpacity: 0.6,
            color: color,
            weight: 2,
            opacity: 0.8,
          }).addTo(map);

          // Tooltip
          circle.bindTooltip(
            `<div class="text-sm font-medium">${c.name_english}</div>
             <div class="text-xs text-neutral-400">${c.district_english}</div>`,
            {
              permanent: false,
              direction: 'top',
              className: 'constituency-tooltip',
            }
          );

          // Click handler
          circle.on('click', () => {
            router.push(getConstituencyUrl(c));
          });

          // Hover effects
          circle.on('mouseover', () => {
            circle.setStyle({ radius: 12, fillOpacity: 0.9 });
          });
          circle.on('mouseout', () => {
            circle.setStyle({ radius: 8, fillOpacity: 0.6 });
          });
        });

        // Add zoom control to bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapRef.current = map;
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [divisionSlug, router]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="absolute inset-0 rounded-2xl overflow-hidden" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0c]/80 rounded-2xl">
          <div className="w-8 h-8 border-3 border-teal-600/30 border-t-teal-500 rounded-full animate-spin" />
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#0c0c0c]/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-neutral-400">শহর</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-neutral-400">গ্রাম</span>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .constituency-tooltip {
          background: rgba(12, 12, 12, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          color: white !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        }
        .constituency-tooltip::before {
          border-top-color: rgba(12, 12, 12, 0.95) !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          background: rgba(12, 12, 12, 0.9) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: transparent !important;
          color: #9ca3af !important;
          border: none !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}
