'use client';

import Link from 'next/link';

import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

import FilterPanel from './FilterPanel';
import LegendPanel from './LegendPanel';
import StatsPanel from './StatsPanel';

import type { FilterState } from '@/types/map';

interface SidebarProps {
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  selectedConstituency: ConstituencyInfo | null;
  onConstituencySelect: (constituency: ConstituencyInfo | null) => void;
}

export default function Sidebar({
  filterState,
  onFilterChange,
  selectedConstituency,
  onConstituencySelect,
}: SidebarProps) {
  return (
    <div className='relative flex h-full w-80 flex-col overflow-hidden bg-[#0c0c0c]'>
      {/* Subtle glow edge connecting sidebar to map */}
      <div className='absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/30 via-transparent to-amber-500/20 z-10' />

      {/* Header */}
      <div className='px-5 pt-6 pb-5 border-b border-white/[0.04]'>
        <h1 className='text-xl font-bold text-teal-400 tracking-tight'>
          জনতার নির্বাচন ২০২৬
        </h1>
        <p className='mt-1.5 text-sm text-neutral-400'>জনগণই সকল ক্ষমতার উৎস</p>
      </div>

      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto'>
        {/* Filters Section */}
        <div className='px-5 py-4'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-1 h-4 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full' />
            <h3 className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>
              অঞ্চল ফিল্টার
            </h3>
          </div>
          <FilterPanel
            value={filterState}
            onChange={onFilterChange}
            onConstituencySelect={onConstituencySelect}
            selectedConstituency={selectedConstituency}
          />
        </div>

        {/* Divider */}
        <div className='mx-5 h-px bg-white/[0.04]' />

        {/* Selected Constituency */}
        {selectedConstituency && (
          <>
            <div className='px-5 py-4'>
              <div className='p-4 rounded-xl bg-teal-500/[0.06] border border-teal-500/20'>
                <div className='flex items-start justify-between'>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold text-white/90 truncate'>
                      {selectedConstituency.name ||
                        selectedConstituency.name_english}
                    </p>
                    <p className='text-xs text-neutral-500 mt-0.5'>
                      {selectedConstituency.district ||
                        selectedConstituency.district_english}
                    </p>
                    <div className='flex items-center gap-3 mt-2'>
                      <span className='text-xs text-teal-400'>
                        {selectedConstituency.registered_voters.toLocaleString(
                          'en-US',
                        )}{' '}
                        ভোটার
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onConstituencySelect(null)}
                    className='p-1.5 text-neutral-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors'
                  >
                    <svg
                      className='w-4 h-4'
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
              </div>
            </div>
            <div className='mx-5 h-px bg-white/[0.04]' />
          </>
        )}

        {/* Stats Section */}
        <div className='px-5 py-4'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full' />
            <h3 className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>
              পরিসংখ্যান
            </h3>
          </div>
          <StatsPanel filterState={filterState} />
        </div>

        {/* Divider */}
        <div className='mx-5 h-px bg-white/[0.04]' />

        {/* Legend Section */}
        <div className='px-5 py-4'>
          <LegendPanel />
        </div>
      </div>

      {/* Footer */}
      <div className='shrink-0 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/[0.04] space-y-3'>
        <div className='flex items-center justify-center gap-2 text-amber-400/80'>
          <svg
            className='w-4 h-4 shrink-0'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <span className='text-xs'>এটি সরকারি অ্যাপ নয়</span>
        </div>
        <div className='flex items-center justify-center gap-3 text-xs'>
          <Link
            href='/terms'
            className='text-neutral-500 hover:text-white transition-colors'
          >
            শর্তাবলী
          </Link>
          <span className='text-neutral-700'>•</span>
          <Link
            href='/privacy'
            className='text-neutral-500 hover:text-white transition-colors'
          >
            গোপনীয়তা
          </Link>
          <span className='text-neutral-700'>•</span>
          <a
            href='https://www.ecs.gov.bd'
            target='_blank'
            rel='noopener noreferrer'
            className='text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-1'
          >
            EC
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
              />
            </svg>
          </a>
        </div>
        <p className='text-xs text-neutral-600 text-center'>
          তথ্য সূত্র: বাংলাদেশ নির্বাচন কমিশন
        </p>
      </div>
    </div>
  );
}
