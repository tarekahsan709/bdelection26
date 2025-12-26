'use client';

import FilterPanel from './FilterPanel';
import StatsPanel from './StatsPanel';
import LegendPanel from './LegendPanel';
import type { FilterState } from '@/types/map';
import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

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
    <div className="flex h-full w-80 flex-col overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border-r border-white/5">
      {/* Header */}
      <div className="relative px-5 pt-6 pb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-transparent to-transparent" />
        <div className="relative">
          <h1 className="text-xl font-bold text-white tracking-tight">
            বাংলাদেশ নির্বাচন
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            ভোটার ঘনত্ব মানচিত্র
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Filters Section */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
        <div className="mx-5 h-px bg-white/5" />

        {/* Selected Constituency */}
        {selectedConstituency && (
          <>
            <div className="px-5 py-4">
              <div className="p-4 rounded-xl bg-teal-600/5 border border-teal-600/20 shadow-lg shadow-teal-600/5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {selectedConstituency.name_english}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedConstituency.district_english}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-teal-400">
                        {selectedConstituency.registered_voters.toLocaleString()} ভোটার
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onConstituencySelect(null)}
                    className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
          </>
        )}

        {/* Stats Section */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              পরিসংখ্যান
            </h3>
          </div>
          <StatsPanel filterState={filterState} />
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/5" />

        {/* Legend Section */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              চিহ্ন
            </h3>
          </div>
          <LegendPanel />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-xs text-slate-600 text-center">
          তথ্য: বাংলাদেশ নির্বাচন কমিশন
        </p>
      </div>
    </div>
  );
}
