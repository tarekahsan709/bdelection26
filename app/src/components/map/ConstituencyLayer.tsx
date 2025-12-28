'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

export interface ConstituencyInfo {
  id: string;
  name_english: string;
  name: string;
  total_population: number;
  registered_voters: number;
  urban_classification: 'urban' | 'rural';
  lat: number;
  long: number;
  division_id: string;
  division: string;
  division_english: string;
  district_id: string;
  district: string;
  district_english: string;
}

interface ConstituencyLayerProps {
  map: L.Map;
  onConstituencySelect: (constituency: ConstituencyInfo | null) => void;
  onConstituencyHover: (constituency: ConstituencyInfo | null) => void;
  selectedConstituency: ConstituencyInfo | null;
}

function getRadiusForZoom(zoom: number): number {
  if (zoom <= 6) return 18;
  if (zoom === 7) return 22;
  if (zoom === 8) return 28;
  if (zoom === 9) return 35;
  if (zoom === 10) return 45;
  if (zoom === 11) return 55;
  return 65;
}

export default function ConstituencyLayer({
  map,
  onConstituencySelect,
  onConstituencyHover,
  selectedConstituency,
}: ConstituencyLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [constituencies, setConstituencies] = useState<ConstituencyInfo[]>([]);

  // Use refs for callbacks to avoid effect dependencies
  const selectRef = useRef(onConstituencySelect);
  const hoverRef = useRef(onConstituencyHover);
  const selectedRef = useRef(selectedConstituency);

  // Keep refs updated
  useEffect(() => {
    selectRef.current = onConstituencySelect;
    hoverRef.current = onConstituencyHover;
    selectedRef.current = selectedConstituency;
  });

  // Load constituency data once
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await fetch('/data/constituency-voters-2025.json');
        const data = await response.json();
        setConstituencies(data.constituencies.filter((c: ConstituencyInfo) => c.lat && c.long));
      } catch {
        // Error handled silently
      }
    };
    fetchConstituencies();
  }, []);

  // Create and manage layer
  useEffect(() => {
    if (!constituencies.length) return;

    // Clear existing layer
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }

    // Create custom pane
    if (!map.getPane('constituencyPane')) {
      const pane = map.createPane('constituencyPane');
      pane.style.zIndex = '650';
    }

    const layerGroup = L.layerGroup();

    constituencies.forEach((constituency) => {
      const marker = L.circleMarker([constituency.lat, constituency.long], {
        radius: getRadiusForZoom(map.getZoom()),
        fillColor: 'transparent',
        fillOpacity: 0,
        color: 'transparent',
        weight: 0,
        interactive: true,
        pane: 'constituencyPane',
      });

      const tooltipContent = `
        <div class="constituency-tooltip">
          <div class="font-semibold text-white">${constituency.name || constituency.name_english}</div>
          <div class="text-gray-300 text-xs">${constituency.division || constituency.division_english} বিভাগ</div>
          <div class="mt-1 text-xs">
            <span class="text-cyan-400">${constituency.registered_voters.toLocaleString('en-US')}</span> ভোটার
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        className: 'dark-tooltip',
        direction: 'top',
        offset: [0, -10],
      });

      marker.on('click', () => {
        if (selectedRef.current?.id === constituency.id) {
          selectRef.current(null);
        } else {
          selectRef.current(constituency);
        }
      });

      marker.on('mouseover', () => {
        hoverRef.current(constituency);
      });

      marker.on('mouseout', () => {
        hoverRef.current(null);
      });

      marker.addTo(layerGroup);
    });

    layerGroup.addTo(map);
    layerGroupRef.current = layerGroup;

    // Update marker sizes on zoom
    const handleZoom = () => {
      const newRadius = getRadiusForZoom(map.getZoom());
      layerGroup.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          layer.setRadius(newRadius);
        }
      });
    };

    map.on('zoomend', handleZoom);

    return () => {
      map.off('zoomend', handleZoom);
      if (layerGroupRef.current) {
        map.removeLayer(layerGroupRef.current);
      }
    };
  }, [map, constituencies]);

  return null;
}
