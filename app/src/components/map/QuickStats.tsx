'use client';

import { memo, useMemo } from 'react';

import { formatVoterCount } from '@/lib/map-utils';

import { TOTAL_DISTRICTS, TOTAL_DIVISIONS } from '@/constants/site';
import { useConstituencyData } from '@/contexts/ConstituencyDataContext';

interface Stats {
  totalConstituencies: number;
  totalVoters: number;
  totalDivisions: number;
  totalDistricts: number;
  maleVoters: number;
  femaleVoters: number;
}

function QuickStats() {
  const { constituencies, metadata, loading } = useConstituencyData();

  const stats = useMemo<Stats | null>(() => {
    if (loading || constituencies.length === 0) return null;
    const totalVoters = constituencies.reduce(
      (sum, c) => sum + (c.registered_voters || 0),
      0,
    );
    return {
      totalConstituencies: constituencies.length,
      totalVoters,
      totalDivisions: TOTAL_DIVISIONS,
      totalDistricts: TOTAL_DISTRICTS,
      maleVoters: metadata?.male_voters || 0,
      femaleVoters: metadata?.female_voters || 0,
    };
  }, [constituencies, metadata, loading]);

  if (!stats) return null;

  return (
    <div className='absolute bottom-6 left-4 right-4 z-1000 pointer-events-none'>
      <div className='flex flex-wrap gap-2 justify-center pointer-events-auto'>
        <StatCard
          value={stats.totalConstituencies.toString()}
          label='আসন'
          icon='🗳️'
        />
        <StatCard
          value={formatVoterCount(stats.totalVoters)}
          label='ভোটার'
          icon='👥'
        />
        <StatCard
          value={stats.totalDivisions.toString()}
          label='বিভাগ'
          icon='🗺️'
        />
        <StatCard
          value={stats.totalDistricts.toString()}
          label='জেলা'
          icon='📍'
        />
        <StatCard
          value={`${formatVoterCount(stats.maleVoters)}/${formatVoterCount(stats.femaleVoters)}`}
          label='পুরুষ/নারী'
          icon='⚤'
          className='hidden sm:flex'
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  icon: string;
  className?: string;
}

function StatCard({ value, label, icon, className = '' }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg backdrop-blur-sm ${className}`}
    >
      <span className='text-base'>{icon}</span>
      <div>
        <div className='text-sm font-bold text-white'>{value}</div>
        <div className='text-[10px] text-neutral-500'>{label}</div>
      </div>
    </div>
  );
}

export default memo(QuickStats);
