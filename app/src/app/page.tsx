'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import MapContainer from '@/components/map/MapContainer';
import CandidatePanel from '@/components/candidates/CandidatePanel';
import MobileHeader from '@/components/mobile/MobileHeader';
import DevBanner from '@/components/ui/DevBanner';
import type { FilterState } from '@/types/map';
import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

// Parliament Building Silhouette - Louis Kahn's Jatiya Sangsad Bhaban
function ParliamentSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 200" fill="none" className={className} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="horizonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Center block with main circle void */}
      <path d="M390 200 L390 80 L500 60 L610 80 L610 200 Z" fill="currentColor" opacity="0.08" />
      <circle cx="500" cy="120" r="35" fill="#080808" />
      {/* Left block with triangle void */}
      <path d="M180 200 L180 100 L380 100 L380 200 Z" fill="currentColor" opacity="0.06" />
      <polygon points="280,100 320,150 240,150" fill="#080808" />
      {/* Right block with triangle void */}
      <path d="M620 200 L620 100 L820 100 L820 200 Z" fill="currentColor" opacity="0.06" />
      <polygon points="720,100 760,150 680,150" fill="#080808" />
      {/* Far wings */}
      <rect x="60" y="140" width="120" height="60" fill="currentColor" opacity="0.04" />
      <rect x="820" y="140" width="120" height="60" fill="currentColor" opacity="0.04" />
      {/* Ground line */}
      <rect x="40" y="195" width="920" height="5" fill="currentColor" opacity="0.1" />
      {/* Water reflection gradient */}
      <rect x="0" y="195" width="1000" height="100" fill="url(#horizonGrad)" />
    </svg>
  );
}

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
      <main className="flex h-screen w-screen bg-topographic">
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

          {/* Parliament Silhouette - Horizon element */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 hidden md:block">
            <ParliamentSilhouette className="w-full h-32 text-teal-500" />
          </div>
        </div>

        {/* Mobile FAB - Find My Area */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-medium rounded-full shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 active:scale-95 transition-all"
          aria-label="Find my area"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-bangla-sm">আমার এলাকা</span>
        </button>
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
