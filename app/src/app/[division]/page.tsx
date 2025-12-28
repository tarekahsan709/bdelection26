'use client';

import { getConstituencyUrl, slugify } from '@/lib/url-utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Division {
  id: string;
  name: string;
  bn_name: string;
  lat: string;
  long: string;
}

interface Constituency {
  id: string;
  name: string;
  name_english: string;
  division_english: string;
  district_english: string;
  registered_voters: number;
  urban_classification: 'urban' | 'rural';
}

interface DivisionStats {
  totalVoters: number;
  totalConstituencies: number;
  urbanConstituencies: number;
  ruralConstituencies: number;
  districts: string[];
}

export default function DivisionPage() {
  const params = useParams();
  const divisionSlug = params.division as string;

  const [division, setDivision] = useState<Division | null>(null);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [stats, setStats] = useState<DivisionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch divisions
        const divRes = await fetch('/data/bd-divisions.json');
        const divData = await divRes.json();
        const div = divData.divisions.find(
          (d: Division) => slugify(d.name) === divisionSlug
        );
        setDivision(div || null);

        if (!div) {
          setLoading(false);
          return;
        }

        // Fetch constituencies
        const conRes = await fetch('/data/constituency-voters-2025.json');
        const conData = await conRes.json();
        const divConstituencies = conData.constituencies.filter(
          (c: Constituency) => slugify(c.division_english) === divisionSlug
        );
        setConstituencies(divConstituencies);

        // Calculate stats
        const districtSet = new Set<string>();
        divConstituencies.forEach((c: Constituency) => districtSet.add(c.district_english));
        const districts = Array.from(districtSet);
        setStats({
          totalVoters: divConstituencies.reduce((sum: number, c: Constituency) => sum + c.registered_voters, 0),
          totalConstituencies: divConstituencies.length,
          urbanConstituencies: divConstituencies.filter((c: Constituency) => c.urban_classification === 'urban').length,
          ruralConstituencies: divConstituencies.filter((c: Constituency) => c.urban_classification === 'rural').length,
          districts: districts as string[],
        });
      } catch {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [divisionSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!division || !stats) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">বিভাগ পাওয়া যায়নি</p>
          <Link href="/" className="text-teal-400 hover:underline">মানচিত্রে ফিরুন</Link>
        </div>
      </div>
    );
  }

  // Group constituencies by district
  const byDistrict = constituencies.reduce((acc, c) => {
    if (!acc[c.district_english]) acc[c.district_english] = [];
    acc[c.district_english].push(c);
    return acc;
  }, {} as Record<string, Constituency[]>);

  return (
    <div className="min-h-screen bg-[#0c0c0c] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0c0c0c]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 100% 80% at 20% 20%, rgba(13, 148, 136, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 80% 60% at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">মানচিত্র</span>
          </Link>
          <span className="text-sm text-neutral-400">{division.name} Division</span>
          <div className="w-20" />
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
            {division.bn_name}
          </h1>
          <p className="text-2xl text-neutral-400 mb-8">{division.name} Division</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StatCard
              value={formatNumber(stats.totalVoters)}
              label="মোট ভোটার"
              sublabel="Total Voters"
              color="teal"
            />
            <StatCard
              value={stats.totalConstituencies.toString()}
              label="নির্বাচনী এলাকা"
              sublabel="Constituencies"
              color="amber"
            />
            <StatCard
              value={stats.districts.length.toString()}
              label="জেলা"
              sublabel="Districts"
              color="emerald"
            />
            <StatCard
              value={`${stats.urbanConstituencies}/${stats.ruralConstituencies}`}
              label="শহর/গ্রাম"
              sublabel="Urban/Rural"
              color="sky"
            />
          </div>
        </section>

        {/* Division Map Illustration */}
        <section className="mb-12">
          <div className="relative h-48 md:h-64 rounded-2xl bg-gradient-to-br from-teal-500/10 to-amber-500/5 border border-white/[0.06] overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🗺️</div>
              <p className="text-neutral-500 text-sm">{division.name} বিভাগ</p>
              <p className="text-neutral-600 text-xs mt-1">
                {stats.districts.length} জেলা · {stats.totalConstituencies} নির্বাচনী এলাকা
              </p>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-500/5" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-amber-500/5" />
          </div>
        </section>

        {/* Constituencies by District */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            নির্বাচনী এলাকাসমূহ
            <span className="text-neutral-500 text-lg font-normal ml-3">({stats.totalConstituencies})</span>
          </h2>

          <div className="space-y-8">
            {Object.entries(byDistrict)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([district, cons]) => (
                <div key={district}>
                  <h3 className="text-lg font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    {district}
                    <span className="text-neutral-600 text-sm font-normal">({cons.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cons
                      .sort((a, b) => a.name_english.localeCompare(b.name_english))
                      .map((c) => (
                        <ConstituencyCard key={c.id} constituency={c} />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            মানচিত্রে ফিরুন
          </Link>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  value,
  label,
  sublabel,
  color,
}: {
  value: string;
  label: string;
  sublabel: string;
  color: 'teal' | 'amber' | 'emerald' | 'sky';
}) {
  const colors = {
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
      <div className="text-sm mt-1">{label}</div>
      <div className="text-xs text-neutral-500">{sublabel}</div>
    </div>
  );
}

function ConstituencyCard({ constituency }: { constituency: Constituency }) {
  return (
    <Link
      href={getConstituencyUrl(constituency)}
      className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-teal-500/30 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-white group-hover:text-teal-400 transition-colors">
            {constituency.name_english}
          </h4>
          <p className="text-sm text-neutral-500 mt-0.5">{constituency.name}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          constituency.urban_classification === 'urban'
            ? 'bg-teal-500/15 text-teal-400'
            : 'bg-amber-500/15 text-amber-400'
        }`}>
          {constituency.urban_classification === 'urban' ? 'শহর' : 'গ্রাম'}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-neutral-500">
          {formatNumber(constituency.registered_voters)} ভোটার
        </span>
        <svg className="w-4 h-4 text-neutral-600 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} কোটি`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} লক্ষ`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} হাজার`;
  return num.toString();
}
