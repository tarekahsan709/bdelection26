'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import MapContainer from '@/components/map/MapContainer';
import CandidatePanel from '@/components/candidates/CandidatePanel';
import MobileHeader from '@/components/mobile/MobileHeader';
import DevBanner from '@/components/ui/DevBanner';
import type { FilterState } from '@/types/map';
import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

export default function HomePage() {
  const [filterState, setFilterState] = useState<FilterState>({
    divisionId: null,
    districtId: null,
  });
  const [selectedConstituency, setSelectedConstituency] = useState<ConstituencyInfo | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

  const handleConstituencySelect = (constituency: ConstituencyInfo | null) => {
    setSelectedConstituency(constituency);
    if (constituency) {
      setIsPanelExpanded(true);
    }
  };

  return (
    <>
      <main className="flex h-screen w-screen bg-[#080808]">
        {/* Mobile Header - only visible on mobile */}
        <MobileHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          constituency={selectedConstituency}
        />

        {/* Sidebar - hidden on mobile, shown via overlay */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:shrink-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar
            filterState={filterState}
            onFilterChange={setFilterState}
            selectedConstituency={selectedConstituency}
            onConstituencySelect={handleConstituencySelect}
          />
          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Map container */}
        <div className="flex-1 relative pt-14 md:pt-0 overflow-hidden">
          <DevBanner />
          <MapContainer
            filterState={filterState}
            onConstituencySelect={handleConstituencySelect}
            selectedConstituency={selectedConstituency}
          />
        </div>
      </main>

      {/* Candidate Panel - outside main to avoid overflow clipping */}
      <CandidatePanel
        constituency={selectedConstituency}
        onClose={() => setSelectedConstituency(null)}
        isExpanded={isPanelExpanded}
        onToggleExpand={() => setIsPanelExpanded(!isPanelExpanded)}
      />
    </>
  );
}
