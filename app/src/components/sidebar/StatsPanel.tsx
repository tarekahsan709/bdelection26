'use client';

import type { FilterState } from '@/types/map';
import type { ConstituencyPopulation } from '@/types/constituency';
import { useEffect, useState } from 'react';

interface StatsData {
  total: number;
  male: number;
  female: number;
  constituencies: number;
}

interface StatsPanelProps {
  filterState: FilterState;
}

export default function StatsPanel({ filterState }: StatsPanelProps) {
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    male: 0,
    female: 0,
    constituencies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const calculateStats = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/constituency-voters-2025.json', {
          signal: controller.signal,
        });
        const data = await response.json();
        const constituencies: ConstituencyPopulation[] = data.constituencies;

        const filtered = constituencies.filter((c) => {
          if (filterState.divisionId && c.division_id !== filterState.divisionId) {
            return false;
          }
          if (filterState.districtId && c.district_id !== filterState.districtId) {
            return false;
          }
          return true;
        });

        const total = filtered.reduce((sum, c) => sum + (c.registered_voters || 0), 0);

        // Get gender data from metadata (national level only)
        const maleVoters = data.metadata?.male_voters || 0;
        const femaleVoters = data.metadata?.female_voters || 0;

        if (isMounted) {
          setStats({
            total,
            male: maleVoters,
            female: femaleVoters,
            constituencies: filtered.length,
          });
        }
      } catch {
        // Silently handle fetch errors
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    calculateStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [filterState]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 animate-pulse">
            <div className="h-3 w-12 bg-neutral-800 rounded mb-2" />
            <div className="h-5 w-16 bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <StatCard label="মোট ভোটার" value={formatNumber(stats.total)} accent="white" />
      <StatCard label="নির্বাচনী এলাকা" value={stats.constituencies.toString()} accent="white" />
      <StatCard label="পুরুষ" value={formatNumber(stats.male)} accent="teal" />
      <StatCard label="নারী" value={formatNumber(stats.female)} accent="amber" />
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
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
      <p className="text-[11px] text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-lg font-bold tabular-nums ${accentColors[accent]}`}>{value}</p>
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
