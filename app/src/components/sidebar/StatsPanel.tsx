'use client';

import { memo, useMemo } from 'react';

import { useConstituencyData } from '@/contexts/ConstituencyDataContext';

import type { FilterState } from '@/types/map';

interface StatsPanelProps {
  filterState: FilterState;
}

function StatsPanel({ filterState }: StatsPanelProps) {
  const { constituencies, metadata, loading } = useConstituencyData();

  const stats = useMemo(() => {
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
    return (
      <div className='grid grid-cols-2 gap-2'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='p-3 rounded-xl bg-white/5 animate-pulse'>
            <div className='h-3 w-12 bg-neutral-800 rounded mb-2' />
            <div className='h-5 w-16 bg-neutral-800 rounded' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      <StatCard
        label='মোট ভোটার'
        value={formatNumber(stats.total)}
        accent='white'
      />
      <StatCard
        label='নির্বাচনী এলাকা'
        value={stats.constituencies.toString()}
        accent='white'
      />
      <StatCard label='পুরুষ' value={formatNumber(stats.male)} accent='teal' />
      <StatCard
        label='নারী'
        value={formatNumber(stats.female)}
        accent='amber'
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'white' | 'teal' | 'amber';
}) {
  const accentColors = {
    white: 'text-white',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
  };

  return (
    <div className='p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors'>
      <p className='text-[11px] text-neutral-500 uppercase tracking-wide mb-1'>
        {label}
      </p>
      <p className={`text-lg font-bold tabular-nums ${accentColors[accent]}`}>
        {value}
      </p>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + ' কোটি';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + ' লক্ষ';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + ' হাজার';
  }
  return num.toLocaleString('en-US');
}

export default memo(StatsPanel);
