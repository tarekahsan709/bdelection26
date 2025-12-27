'use client';

import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';
import type { FilterState } from '@/types/map';
import FilterPanel from './FilterPanel';
import LegendPanel from './LegendPanel';
import StatsPanel from './StatsPanel';

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
    <div className="relative flex h-full w-80 flex-col overflow-hidden bg-[#0c0c0c]">
      {/* Subtle glow edge connecting sidebar to map */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/30 via-transparent to-amber-500/20 z-10" />

      {/* Header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.04]">
        <h1 className="text-xl font-bold text-white/90 tracking-tight">
          বাংলাদেশ নির্বাচন 2026
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          ভোটার ঘনত্ব মানচিত্র
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Filters Section */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full" />
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
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
        <div className="mx-5 h-px bg-white/[0.04]" />

        {/* Selected Constituency */}
        {selectedConstituency && (
          <>
            <div className="px-5 py-4">
              <div className="p-4 rounded-xl bg-teal-500/[0.06] border border-teal-500/20">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white/90 truncate">
                      {selectedConstituency.name || selectedConstituency.name_english}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {selectedConstituency.district || selectedConstituency.district_english}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-teal-400">
                        {selectedConstituency.registered_voters.toLocaleString('bn-BD')} ভোটার
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onConstituencySelect(null)}
                    className="p-1.5 text-neutral-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-5 h-px bg-white/[0.04]" />
          </>
        )}

        {/* Stats Section */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              পরিসংখ্যান
            </h3>
          </div>
          <StatsPanel filterState={filterState} />
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.04]" />

        {/* Legend Section */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              চিহ্ন
            </h3>
          </div>
          <LegendPanel />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.04]">
        <p className="text-xs text-neutral-600 text-center">
          তথ্য সূত্র: বাংলাদেশ নির্বাচন কমিশন
        </p>
      </div>
    </div>
  );
}
