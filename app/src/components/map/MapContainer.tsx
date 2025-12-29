'use client';

import dynamic from 'next/dynamic';

import MapSkeleton from '@/components/ui/MapSkeleton';

import type { ConstituencyInfo } from '@/types/constituency';
import type { FilterState } from '@/types/map';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface MapContainerProps {
  filterState: FilterState;
  onConstituencySelect?: (constituency: ConstituencyInfo | null) => void;
  selectedConstituency?: ConstituencyInfo | null;
}

export default function MapContainer({
  filterState,
  onConstituencySelect,
  selectedConstituency,
}: MapContainerProps) {
  return (
    <LeafletMap
      filterState={filterState}
      onConstituencySelect={onConstituencySelect}
      selectedConstituency={selectedConstituency}
    />
  );
}
