'use client';

import dynamic from 'next/dynamic';
import type { FilterState } from '@/types/map';
import type { ConstituencyInfo } from './ConstituencyLayer';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className='flex h-full w-full items-center justify-center bg-[#080808]'>
      <div className="w-8 h-8 border-3 border-teal-600/30 border-t-teal-500 rounded-full animate-spin" />
    </div>
  ),
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
