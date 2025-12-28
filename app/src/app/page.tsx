'use client';

import { useState } from 'react';

import CandidatePanel from '@/components/candidates/CandidatePanel';
import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';
import MapContainer from '@/components/map/MapContainer';
import MobileHeader from '@/components/mobile/MobileHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import DevBanner from '@/components/ui/DevBanner';

import type { FilterState } from '@/types/map';

// Gradient Orbs Background - matches details page
function ParallaxBackground() {
  return (
    <div className='fixed inset-0 pointer-events-none'>
      <div className='absolute inset-0 bg-[#0c0c0c]' />
      <div
        className='absolute inset-0 opacity-40'
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 10% 20%, rgba(13, 148, 136, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 90% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 40%)
          `,
        }}
      />
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className='absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  );
}

// Detailed Parliament Illustration - Louis Kahn's Jatiya Sangsad Bhaban
function ParliamentIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox='0 0 1000 500' fill='none' className={className}>
      <defs>
        <mask id='centerMask'>
          <rect x='0' y='0' width='1000' height='500' fill='white' />
          <circle cx='500' cy='195' r='75' fill='black' />
          <circle cx='420' cy='95' r='22' fill='black' />
          <circle cx='500' cy='85' r='28' fill='black' />
          <circle cx='580' cy='95' r='22' fill='black' />
          <ellipse cx='500' cy='320' rx='55' ry='35' fill='black' />
        </mask>
        <mask id='leftBlockMask'>
          <rect x='0' y='0' width='1000' height='500' fill='white' />
          <polygon points='280,70 340,180 220,180' fill='black' />
          <circle cx='280' cy='235' r='50' fill='black' />
        </mask>
        <mask id='rightBlockMask'>
          <rect x='0' y='0' width='1000' height='500' fill='white' />
          <polygon points='720,70 780,180 660,180' fill='black' />
          <circle cx='720' cy='235' r='50' fill='black' />
        </mask>
        <pattern
          id='striations'
          patternUnits='userSpaceOnUse'
          width='1000'
          height='8'
        >
          <line
            x1='0'
            y1='4'
            x2='1000'
            y2='4'
            stroke='currentColor'
            strokeWidth='0.5'
            opacity='0.15'
          />
        </pattern>
        <linearGradient id='reflectionGrad' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='currentColor' stopOpacity='0.15' />
          <stop offset='100%' stopColor='currentColor' stopOpacity='0' />
        </linearGradient>
      </defs>
      <g mask='url(#centerMask)'>
        <rect
          x='390'
          y='55'
          width='220'
          height='280'
          fill='currentColor'
          opacity='0.35'
        />
        <rect x='390' y='55' width='220' height='280' fill='url(#striations)' />
        <rect
          x='390'
          y='55'
          width='220'
          height='280'
          stroke='currentColor'
          strokeWidth='1.5'
          fill='none'
          opacity='0.6'
        />
      </g>
      <g mask='url(#leftBlockMask)'>
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          fill='currentColor'
          opacity='0.28'
        />
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          fill='url(#striations)'
        />
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          stroke='currentColor'
          strokeWidth='1.2'
          fill='none'
          opacity='0.5'
        />
      </g>
      <g mask='url(#rightBlockMask)'>
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          fill='currentColor'
          opacity='0.28'
        />
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          fill='url(#striations)'
        />
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          stroke='currentColor'
          strokeWidth='1.2'
          fill='none'
          opacity='0.5'
        />
      </g>
      <g>
        <rect
          x='60'
          y='200'
          width='120'
          height='135'
          fill='currentColor'
          opacity='0.2'
        />
        <rect x='60' y='200' width='120' height='135' fill='url(#striations)' />
        <rect
          x='60'
          y='200'
          width='120'
          height='135'
          stroke='currentColor'
          strokeWidth='1'
          fill='none'
          opacity='0.4'
        />
        <rect x='75' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='95' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='115' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='135' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='155' y='220' width='12' height='80' fill='#0c0c0c' />
      </g>
      <g>
        <rect
          x='820'
          y='200'
          width='120'
          height='135'
          fill='currentColor'
          opacity='0.2'
        />
        <rect
          x='820'
          y='200'
          width='120'
          height='135'
          fill='url(#striations)'
        />
        <rect
          x='820'
          y='200'
          width='120'
          height='135'
          stroke='currentColor'
          strokeWidth='1'
          fill='none'
          opacity='0.4'
        />
        <rect x='833' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='853' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='873' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='893' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='913' y='220' width='12' height='80' fill='#0c0c0c' />
      </g>
      <rect
        x='40'
        y='335'
        width='920'
        height='8'
        fill='currentColor'
        opacity='0.25'
      />
      <g opacity='0.4' transform='translate(0, 350) scale(1, -0.4)'>
        <rect
          x='390'
          y='55'
          width='220'
          height='280'
          fill='url(#reflectionGrad)'
        />
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          fill='url(#reflectionGrad)'
        />
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          fill='url(#reflectionGrad)'
        />
      </g>
      <g stroke='currentColor' opacity='0.1'>
        <line x1='100' y1='380' x2='900' y2='380' strokeWidth='0.5' />
        <line x1='150' y1='400' x2='850' y2='400' strokeWidth='0.5' />
        <line x1='200' y1='420' x2='800' y2='420' strokeWidth='0.5' />
        <line x1='250' y1='440' x2='750' y2='440' strokeWidth='0.5' />
      </g>
      <g stroke='currentColor' fill='none' opacity='0.5'>
        <circle cx='500' cy='195' r='75' strokeWidth='1' />
        <circle cx='420' cy='95' r='22' strokeWidth='0.8' />
        <circle cx='500' cy='85' r='28' strokeWidth='0.8' />
        <circle cx='580' cy='95' r='22' strokeWidth='0.8' />
        <ellipse cx='500' cy='320' rx='55' ry='35' strokeWidth='0.8' />
        <polygon points='280,70 340,180 220,180' strokeWidth='0.8' />
        <circle cx='280' cy='235' r='50' strokeWidth='0.8' />
        <polygon points='720,70 780,180 660,180' strokeWidth='0.8' />
        <circle cx='720' cy='235' r='50' strokeWidth='0.8' />
      </g>
    </svg>
  );
}

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

  return (
    <>
      <ParallaxBackground />
      <main className='relative flex h-screen w-screen'>
        {/* Mobile Header - only visible on mobile */}
        <MobileHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          constituency={selectedConstituency}
        />

        {/* Sidebar - hidden on mobile, shown via overlay */}
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
            onClick={() => setIsSidebarOpen(false)}
            className='absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-neutral-500 active:text-white active:bg-white/10 rounded-lg md:hidden'
            aria-label='Close menu'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 z-1050 bg-black/50 md:hidden'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Map container */}
        <div className='flex-1 relative pt-14 md:pt-0 overflow-hidden'>
          {/* Contour pattern overlay */}
          <div
            className='absolute inset-0 pointer-events-none z-[1] opacity-[0.03]'
            style={{
              backgroundImage: `
                repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px),
                repeating-radial-gradient(circle at 30% 70%, transparent 0, transparent 15px, rgba(255,255,255,0.02) 15px, rgba(255,255,255,0.02) 16px),
                repeating-radial-gradient(circle at 70% 30%, transparent 0, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px)
              `,
            }}
          />

          <DevBanner />
          <MapContainer
            filterState={filterState}
            onConstituencySelect={handleConstituencySelect}
            selectedConstituency={selectedConstituency}
          />

          {/* Live Ticker - makes the site feel alive */}
          <div className='absolute top-16 md:top-4 right-4 z-20 hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-xs text-neutral-400'>
              <span className='text-emerald-400 font-medium'>৩০০</span>{' '}
              নির্বাচনী এলাকা
            </span>
          </div>

          {/* Parliament Illustration - Horizon element */}
          <div className='absolute bottom-0 left-0 right-0 pointer-events-none z-10 hidden md:block'>
            <ParliamentIllustration className='w-full h-48 text-teal-500' />
          </div>
        </div>

        {/* Hide FAB when constituency panel is open */}
        {!selectedConstituency && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='fixed bottom-16 right-4 z-40 md:hidden flex items-center gap-2 px-5 py-3.5 bg-linear-to-r from-teal-600 to-teal-500 text-white font-medium rounded-full shadow-lg shadow-teal-500/25 active:scale-95 transition-transform'
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
            aria-label='Find my area'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <span>আমার এলাকা</span>
          </button>
        )}
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
