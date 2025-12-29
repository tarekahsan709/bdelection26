'use client';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import { getConstituencyRadius } from '@/lib/map-utils';

import { DATA_PATHS, PANE_Z_INDEX } from '@/constants/map';

import type { ConstituencyInfo } from '@/types/constituency';

interface ConstituencyLayerProps {
  map: L.Map;
  onConstituencySelect: (constituency: ConstituencyInfo | null) => void;
  onConstituencyHover: (constituency: ConstituencyInfo | null) => void;
  selectedConstituency: ConstituencyInfo | null;
}

export default function ConstituencyLayer({
  map,
  onConstituencySelect,
  onConstituencyHover,
  selectedConstituency,
}: ConstituencyLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [constituencies, setConstituencies] = useState<ConstituencyInfo[]>([]);

  const selectRef = useRef(onConstituencySelect);
  const hoverRef = useRef(onConstituencyHover);
  const selectedRef = useRef(selectedConstituency);

  useEffect(() => {
    selectRef.current = onConstituencySelect;
    hoverRef.current = onConstituencyHover;
    selectedRef.current = selectedConstituency;
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchConstituencies = async () => {
      try {
        const response = await fetch(DATA_PATHS.constituencyVoters, {
          signal: controller.signal,
        });
        const data = await response.json();
        setConstituencies(
          data.constituencies.filter((c: ConstituencyInfo) => c.lat && c.long),
        );
      } catch {
        // Silently handle fetch errors
      }
    };
    fetchConstituencies();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!constituencies.length) return;

    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }

    if (!map.getPane('constituencyPane')) {
      const pane = map.createPane('constituencyPane');
      pane.style.zIndex = String(PANE_Z_INDEX.constituency);
    }

    const layerGroup = L.layerGroup();

    constituencies.forEach((constituency) => {
      const marker = L.circleMarker([constituency.lat, constituency.long], {
        radius: getConstituencyRadius(map.getZoom()),
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

    const handleZoom = () => {
      const newRadius = getConstituencyRadius(map.getZoom());
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
