'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalConstituencies: number;
  totalVoters: number;
  totalDivisions: number;
  totalDistricts: number;
  maleVoters: number;
  femaleVoters: number;
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/constituency-voters-2025.json', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalConstituencies: data.statistics?.total_constituencies || 300,
          totalVoters: data.statistics?.total_voters || 0,
          totalDivisions: 8,
          totalDistricts: 64,
          maleVoters: data.metadata?.male_voters || data.statistics?.male_voters || 0,
          femaleVoters: data.metadata?.female_voters || data.statistics?.female_voters || 0,
        });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  if (!stats) return null;

  const formatVoters = (num: number): string => {
    const crore = num / 10000000;
    return crore.toFixed(1) + ' কোটি';
  };

  return (
    <div className="absolute bottom-6 left-4 right-4 z-1000 pointer-events-none">
      <div className="flex flex-wrap gap-2 justify-center pointer-events-auto">
        <StatCard value={stats.totalConstituencies.toString()} label="আসন" icon="🗳️" />
        <StatCard value={formatVoters(stats.totalVoters)} label="ভোটার" icon="👥" />
        <StatCard value={stats.totalDivisions.toString()} label="বিভাগ" icon="🗺️" />
        <StatCard value={stats.totalDistricts.toString()} label="জেলা" icon="📍" />
        <StatCard
          value={`${formatVoters(stats.maleVoters)}/${formatVoters(stats.femaleVoters)}`}
          label="পুরুষ/নারী"
          icon="⚤"
          className="hidden sm:flex"
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
      <span className="text-base">{icon}</span>
      <div>
        <div className="text-sm font-bold text-white">{value}</div>
        <div className="text-[10px] text-neutral-500">{label}</div>
      </div>
    </div>
  );
}
