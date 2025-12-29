'use client';

import { memo, useMemo } from 'react';

import { formatBengaliNumber } from '@/lib/sidebar-utils';

import {
  type StatAccent,
  SIDEBAR_TEXT,
  SIDEBAR_UI,
  STAT_ACCENTS,
} from '@/constants/sidebar';
import { useConstituencyData } from '@/contexts/ConstituencyDataContext';

import type { FilterState } from '@/types/map';

// =============================================================================
// Types
// =============================================================================

interface StatsPanelProps {
  filterState: FilterState;
}

interface Stats {
  total: number;
  male: number;
  female: number;
  constituencies: number;
}

// =============================================================================
// Sub-Components
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {Array.from({ length: SIDEBAR_UI.STATS_SKELETON_COUNT }).map((_, i) => (
        <div key={i} className='p-3 rounded-xl bg-white/5 animate-pulse'>
          <div className='h-3 w-12 bg-neutral-800 rounded mb-2' />
          <div className='h-5 w-16 bg-neutral-800 rounded' />
        </div>
      ))}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  accent: StatAccent;
}

function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className='p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors'>
      <p className='text-[11px] text-neutral-500 uppercase tracking-wide mb-1'>
        {label}
      </p>
      <p className={`text-lg font-bold tabular-nums ${STAT_ACCENTS[accent]}`}>
        {value}
      </p>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

function StatsPanel({ filterState }: StatsPanelProps) {
  const { constituencies, metadata, loading } = useConstituencyData();

  const stats = useMemo<Stats>(() => {
    const filtered = constituencies.filter((c) => {
      if (filterState.divisionId && c.division_id !== filterState.divisionId) {
        return false;
      }
      if (filterState.districtId && c.district_id !== filterState.districtId) {
        return false;
      }
      return true;
    });

    const total = filtered.reduce(
      (sum, c) => sum + (c.registered_voters || 0),
      0,
    );

    return {
      total,
      male: metadata?.male_voters || 0,
      female: metadata?.female_voters || 0,
      constituencies: filtered.length,
    };
  }, [constituencies, metadata, filterState]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      <StatCard
        label={SIDEBAR_TEXT.stats.totalVoters}
        value={formatBengaliNumber(stats.total)}
        accent='white'
      />
      <StatCard
        label={SIDEBAR_TEXT.stats.constituencies}
        value={stats.constituencies.toString()}
        accent='white'
      />
      <StatCard
        label={SIDEBAR_TEXT.stats.male}
        value={formatBengaliNumber(stats.male)}
        accent='teal'
      />
      <StatCard
        label={SIDEBAR_TEXT.stats.female}
        value={formatBengaliNumber(stats.female)}
        accent='amber'
      />
    </div>
  );
}

export default memo(StatsPanel);
