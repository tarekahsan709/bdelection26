'use client';

import { useState } from 'react';

import CandidatePanel from '@/components/candidates/CandidatePanel';
import { CloseIcon, SearchIcon } from '@/components/icons';
import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';
import MapContainer from '@/components/map/MapContainer';
import MobileHeader from '@/components/mobile/MobileHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import DevBanner from '@/components/ui/DevBanner';
import { ParallaxBackground } from '@/components/ui/ParallaxBackground';
import { ParliamentIllustration } from '@/components/ui/ParliamentIllustration';

import { TOTAL_CONSTITUENCIES_BN } from '@/constants/site';

import type { FilterState } from '@/types/map';

export default function HomePage() {
  const [filterState, setFilterState] = useState<FilterState>({
    divisionId: null,
    districtId: null,
  });
  const [selectedConstituency, setSelectedConstituency] =
    useState<ConstituencyInfo | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

  const handleConstituencySelect = (constituency: ConstituencyInfo | null) => {
    setSelectedConstituency(constituency);
    if (constituency) {
      setIsPanelExpanded(true);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  return (
    <>
      <ParallaxBackground />
      <main className='relative flex h-screen w-screen isolate'>
        <MobileHeader
          onMenuClick={openSidebar}
          constituency={selectedConstituency}
        />

        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-1100 w-80 transform transition-transform duration-300 ease-in-out
            md:relative md:z-auto md:translate-x-0 md:shrink-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar
            filterState={filterState}
            onFilterChange={setFilterState}
            selectedConstituency={selectedConstituency}
            onConstituencySelect={handleConstituencySelect}
          />
          <button
            onClick={closeSidebar}
            className='absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-neutral-500 active:text-white active:bg-white/10 rounded-lg md:hidden'
            aria-label='মেনু বন্ধ করুন'
          >
            <CloseIcon />
          </button>
        </div>

        {/* Sidebar overlay */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 z-1050 bg-black/50 md:hidden'
            onClick={closeSidebar}
          />
        )}

        {/* Map area */}
        <div className='flex-1 relative pt-14 md:pt-0 overflow-hidden isolate z-0'>
          <DevBanner />
          <MapContainer
            filterState={filterState}
            onConstituencySelect={handleConstituencySelect}
            selectedConstituency={selectedConstituency}
          />

          {/* Constituency count badge */}
          <div className='absolute top-16 md:top-4 right-4 z-20 hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-xs text-neutral-400'>
              <span className='text-emerald-400 font-medium'>
                {TOTAL_CONSTITUENCIES_BN}
              </span>{' '}
              নির্বাচনী এলাকা
            </span>
          </div>

          {/* Parliament illustration */}
          <div className='absolute bottom-0 left-0 right-0 pointer-events-none z-500 hidden md:block'>
            <ParliamentIllustration className='w-full h-48 text-teal-500/50' />
          </div>
        </div>

        {/* Mobile search FAB */}
        {!selectedConstituency && (
          <button
            onClick={openSidebar}
            className='fixed bottom-4 right-4 z-40 md:hidden flex items-center gap-2 px-5 py-3.5 bg-linear-to-r from-teal-600 to-teal-500 text-white font-medium rounded-full shadow-lg shadow-teal-500/25 active:scale-95 transition-transform'
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
            aria-label='আমার এলাকা খুঁজুন'
          >
            <SearchIcon />
            <span>আমার এলাকা</span>
          </button>
        )}
      </main>

      <CandidatePanel
        constituency={selectedConstituency}
        onClose={() => setSelectedConstituency(null)}
        isExpanded={isPanelExpanded}
        onToggleExpand={() => setIsPanelExpanded(!isPanelExpanded)}
      />
    </>
  );
}
