'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PARTY_COLORS } from '@/config/colors';

// Minimal Background - Golden Delta subtle gradient
function ParallaxBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Base solid dark */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Golden Delta gradient glow - teal and gold */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(13, 148, 136, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(245, 158, 11, 0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2, 6, 23, 0.5) 100%)',
        }}
      />
    </div>
  );
}

interface Candidate {
  candidate_id: number;
  constituency_id: number;
  candidate_name?: string;
  candidate_name_english?: string;
  party: string;
}

interface DevelopmentData {
  constituency_id: string;
  name_english: string;
  name: string;
  district: string;
  division: string;
  registered_voters: number | null;
  urban_classification: 'urban' | 'rural';
  overall_score: number;
  scores: {
    education: number;
    healthcare: number;
    finance: number;
    commerce: number;
    transport: number;
  };
  categories: {
    education: { count: number };
    healthcare: { count: number };
    finance: { count: number };
    commerce: { count: number };
    transport: { count: number };
  };
}

interface DevelopmentScoresData {
  national_average: Record<string, number>;
  constituencies: DevelopmentData[];
}

// Re-export for backward compatibility with proper typing
const PARTY_CONFIG: Record<string, { color: string; bg: string; name: string; fullName: string; fullNameBn: string }> = PARTY_COLORS;

export default function ConstituencyPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<DevelopmentData | null>(null);
  const [allData, setAllData] = useState<DevelopmentScoresData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const constituencyId = params.id as string;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const devResponse = await fetch('/data/development-scores.json');
        const devJson: DevelopmentScoresData = await devResponse.json();
        setAllData(devJson);
        const constituency = devJson.constituencies.find(
          (c) => c.constituency_id === constituencyId
        );
        setData(constituency || null);

        const allCandidates: Candidate[] = [];
        const cId = parseInt(constituencyId);

        try {
          const bnpRes = await fetch('/data/bnp_candidates.json');
          const bnpData = await bnpRes.json();
          const bnp = bnpData.candidates
            .filter((c: Candidate) => c.constituency_id === cId)
            .map((c: Candidate) => ({ ...c, party: 'BNP' }));
          allCandidates.push(...bnp);
        } catch {
          // BNP data not available
        }

        try {
          const jamaatRes = await fetch('/data/jamat_candidate.json');
          const jamaatData = await jamaatRes.json();
          const jamaat = (jamaatData.candidates || [])
            .filter((c: Candidate) => c.constituency_id === cId)
            .map((c: Candidate) => ({ ...c, party: 'Jamaat' }));
          allCandidates.push(...jamaat);
        } catch {
          // Jamaat data not available
        }

        try {
          const ncpRes = await fetch('/data/ncp_candidates.json');
          const ncpData = await ncpRes.json();
          const ncp = ncpData.candidates
            .filter((c: Candidate) => c.constituency_id === cId)
            .map((c: Candidate) => ({ ...c, party: 'NCP' }));
          allCandidates.push(...ncp);
        } catch {
          // NCP data not available
        }

        setCandidates(allCandidates);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [constituencyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !allData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">নির্বাচনী এলাকা পাওয়া যায়নি</p>
          <Link href="/" className="text-teal-400 hover:underline">মানচিত্রে ফিরুন</Link>
        </div>
      </div>
    );
  }

  const voters = data.registered_voters || 400000;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Artistic Parallax Background */}
      <ParallaxBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-white">{data.name_english}</h1>
            <p className="text-xs text-slate-500">{data.district} · {data.division}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            data.urban_classification === 'urban'
              ? 'bg-teal-600/20 text-teal-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {data.urban_classification === 'urban' ? 'শহর' : 'গ্রাম'}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Section 1: প্রার্থীগণ - Candidates */}
        <section>
          <div className="text-center mb-8">
            <p className="text-teal-400/80 text-sm font-medium mb-2">যারা আপনার ভোট চাইছেন</p>
            <h2 className="text-3xl font-bold text-white">প্রার্থীগণ</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, idx) => (
              <CandidateCard key={idx} candidate={candidate} />
            ))}
          </div>

          {candidates.length === 0 && (
            <p className="text-center text-slate-500">প্রার্থীর তথ্য পাওয়া যায়নি</p>
          )}
        </section>

        {/* Visual Divider */}
        <div className="flex items-center justify-center py-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Section 2: এমপির ক্ষমতা - MP Power Journey */}
        <section>
          <div className="text-center mb-8">
            <p className="text-amber-400/80 text-sm font-medium mb-2">নির্বাচিত হলে কী ক্ষমতা পাবেন</p>
            <h2 className="text-3xl font-bold text-white">এমপির যাত্রা</h2>
          </div>

          {/* Power Flow Visualization */}
          <PowerJourney voters={voters} />
        </section>

        {/* Visual Divider */}
        <div className="flex items-center justify-center py-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Section 3: সম্ভাবনা - What MP Can Deliver */}
        <section>
          <div className="text-center mb-10">
            <p className="text-emerald-400/80 text-sm font-medium mb-2">একজন এমপি কী আনতে পারেন</p>
            <h2 className="text-3xl font-bold text-white">সম্ভাবনার দিগন্ত</h2>
          </div>

          <SeedsOfChange />
        </section>

        {/* Visual Divider */}
        <div className="flex items-center justify-center py-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Section 4: বর্তমান অবস্থা - Current Reality */}
        <section>
          <div className="text-center mb-10">
            <p className="text-amber-400/80 text-sm font-medium mb-2">আপনার এলাকায় এখন কী আছে</p>
            <h2 className="text-3xl font-bold text-white">বর্তমান চিত্র</h2>
          </div>

          <GardenView data={data} voters={voters} />
        </section>

        {/* Final Section: সিদ্ধান্ত */}
        <section className="relative py-12 px-8 rounded-3xl overflow-hidden">
          {/* Background gradient - Golden Delta colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-amber-500/5 to-emerald-500/10" />
          <div className="absolute inset-0 bg-slate-950/50" />

          <div className="relative text-center">
            <h2 className="text-2xl font-bold text-white mb-4">সিদ্ধান্ত আপনার</h2>
            <p className="text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
              আপনি দেখলেন কারা প্রার্থী। জানলেন তাদের হাতে কী ক্ষমতা থাকবে।
              বুঝলেন আপনার এলাকার বর্তমান অবস্থা।
            </p>
            <p className="text-xl font-medium text-teal-400">
              {formatNumber(voters)} ভোটারের আওয়াজ কার হাতে তুলে দেবেন?
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            মানচিত্রে ফিরুন
          </Link>
          <p className="mt-4 text-xs text-slate-600">
            তথ্য শুধুমাত্র জানার জন্য
          </p>
        </div>
      </main>
    </div>
  );
}

// Polished Candidate Card
function CandidateCard({ candidate }: { candidate: Candidate }) {
  const name = candidate.candidate_name_english || candidate.candidate_name || 'Unknown';
  const bengaliName = candidate.candidate_name && candidate.candidate_name_english ? candidate.candidate_name : null;
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const config = PARTY_CONFIG[candidate.party] || {
    color: '#666',
    bg: 'rgba(100,100,100,0.15)',
    name: candidate.party,
    fullName: candidate.party
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all hover:bg-slate-900/80">
      {/* Party color accent */}
      <div
        className="absolute top-0 left-6 right-6 h-1 rounded-b-full"
        style={{ backgroundColor: config.color }}
      />

      <div className="pt-4 text-center">
        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-lg"
          style={{ backgroundColor: config.bg, color: config.color, boxShadow: `0 8px 32px ${config.bg}` }}
        >
          {initials}
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
        {bengaliName && (
          <p className="text-sm text-slate-500 mb-3">{bengaliName}</p>
        )}

        {/* Party Badge */}
        <div className="inline-flex flex-col items-center">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            {config.name}
          </span>
          <span className="text-xs text-slate-600 mt-1">{config.fullName}</span>
        </div>
      </div>
    </div>
  );
}

// Power Journey Icons
const JourneyIcons = {
  vote: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="10" y="8" width="28" height="32" rx="2" />
      <path d="M18 20l4 4 8-8" />
      <path d="M10 30h28" />
    </svg>
  ),
  parliament: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M6 40h36" />
      <path d="M10 40V24M18 40V24M30 40V24M38 40V24" />
      <path d="M6 24l18-14 18 14" />
    </svg>
  ),
  budget: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <circle cx="24" cy="24" r="16" />
      <path d="M24 14v20M18 20h8c2 0 4 2 4 4s-2 4-4 4h-6c-2 0-4 2-4 4s2 4 4 4h8" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="8" y="12" width="32" height="28" rx="2" />
      <path d="M8 20h32" />
      <path d="M16 28h16M16 34h10" />
    </svg>
  ),
  time: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <circle cx="24" cy="24" r="16" />
      <path d="M24 14v10l6 6" />
    </svg>
  ),
};

// এমপির যাত্রা - Power Journey in Bengali
function PowerJourney({ voters }: { voters: number }) {
  const steps = [
    { icon: JourneyIcons.vote, label: 'নির্বাচন', value: 'আপনার ভোটে', sub: `${formatNumber(voters)} ভোটার` },
    { icon: JourneyIcons.parliament, label: 'সংসদ', value: '৩০০ আসন', sub: 'জাতীয় সংসদ' },
    { icon: JourneyIcons.budget, label: 'বাজেট', value: '৳২৫+ কোটি', sub: 'উন্নয়ন তহবিল' },
    { icon: JourneyIcons.project, label: 'প্রকল্প', value: 'অনুমোদন', sub: 'রাস্তা, স্কুল...' },
    { icon: JourneyIcons.time, label: 'মেয়াদ', value: '৫ বছর', sub: 'পূর্ণ ক্ষমতা' },
  ];

  return (
    <div className="relative">
      {/* Desktop: Horizontal flow */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {/* Connecting line - Golden Delta gradient */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500/50 via-amber-500/50 to-emerald-500/50 -translate-y-1/2" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              {/* Circle with SVG icon */}
              <div className="w-20 h-20 p-4 rounded-full bg-slate-800 border-2 border-white/20 text-amber-400 z-10 shadow-lg">
                {step.icon}
              </div>
              {/* Label */}
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">{step.label}</p>
                <p className="text-lg font-bold text-white">{step.value}</p>
                <p className="text-xs text-slate-600">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical flow */}
      <div className="md:hidden space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-14 h-14 p-3 rounded-full bg-slate-800 border-2 border-white/20 text-amber-400 shrink-0">
              {step.icon}
            </div>
            <div className="flex-1 py-3 px-4 rounded-xl bg-slate-800/50 border border-white/5">
              <p className="text-xs text-slate-500">{step.label}</p>
              <p className="text-lg font-bold text-white">{step.value}</p>
              <p className="text-xs text-slate-600">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary message */}
      <p className="text-center text-slate-400 text-sm mt-8 max-w-md mx-auto">
        এক ভোট → এক এমপি → আপনার এলাকার ভবিষ্যৎ
      </p>
    </div>
  );
}

// Custom SVG Icons
const Icons = {
  road: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M8 40L20 8h8l12 32" />
      <path d="M24 14v4M24 24v4M24 34v4" strokeDasharray="0" />
      <path d="M14 32h20" opacity="0.5" />
    </svg>
  ),
  school: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M6 20l18-10 18 10" />
      <path d="M10 22v14h28V22" />
      <path d="M20 36V28h8v8" />
      <circle cx="24" cy="16" r="2" fill="currentColor" />
    </svg>
  ),
  health: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="8" y="14" width="32" height="24" rx="2" />
      <path d="M24 20v12M18 26h12" />
      <path d="M16 14V10a8 8 0 0116 0v4" />
    </svg>
  ),
  electricity: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M28 6L16 24h10l-6 18 18-22H26l6-14z" fill="currentColor" fillOpacity="0.1" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M24 6C24 6 12 20 12 28a12 12 0 0024 0c0-8-12-22-12-22z" fill="currentColor" fillOpacity="0.1" />
      <path d="M18 30a6 6 0 006 6" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M6 24l18-16 18 16" />
      <path d="M10 22v18h28V22" />
      <path d="M20 40V30h8v10" />
    </svg>
  ),
};

// সম্ভাবনার বীজ - MP Powers in Bengali
function SeedsOfChange() {
  const powers = [
    { icon: Icons.road, label: 'রাস্তা', desc: 'সংযোগের পথ' },
    { icon: Icons.school, label: 'বিদ্যালয়', desc: 'জ্ঞানের আলো' },
    { icon: Icons.health, label: 'স্বাস্থ্য', desc: 'সেবার হাত' },
    { icon: Icons.electricity, label: 'বিদ্যুৎ', desc: 'আলোর দিশা' },
    { icon: Icons.water, label: 'পানি', desc: 'জীবনের ধারা' },
    { icon: Icons.home, label: 'আবাসন', desc: 'নিরাপদ ছাদ' },
  ];

  return (
    <div className="space-y-8">
      {/* Grid of powers */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {powers.map((power, idx) => (
          <div key={idx} className="group text-center">
            <div className="w-16 h-16 mx-auto mb-3 p-3 rounded-2xl bg-slate-800/50 border border-white/5 text-teal-400 group-hover:text-teal-300 group-hover:border-teal-500/30 group-hover:bg-teal-500/10 transition-all">
              {power.icon}
            </div>
            <p className="text-sm font-medium text-white">{power.label}</p>
            <p className="text-xs text-slate-600">{power.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-slate-500 text-sm">
        &quot;যে ক্ষমতা পাবে, সে পরিবর্তন আনতে পারবে&quot;
      </p>
    </div>
  );
}

// Development Icons
const DevIcons = {
  healthcare: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="8" y="14" width="32" height="24" rx="2" />
      <path d="M24 20v12M18 26h12" />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M6 18l18-8 18 8-18 8-18-8z" />
      <path d="M12 22v10c0 4 5.4 6 12 6s12-2 12-6V22" />
      <path d="M42 18v12" />
    </svg>
  ),
  finance: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="6" y="12" width="36" height="28" rx="2" />
      <path d="M6 20h36" />
      <circle cx="24" cy="30" r="6" />
      <path d="M12 12V8h24v4" />
    </svg>
  ),
  commerce: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M8 16h32v24H8z" />
      <path d="M8 16l4-8h24l4 8" />
      <path d="M20 40V28h8v12" />
    </svg>
  ),
  transport: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="8" y="12" width="32" height="22" rx="4" />
      <circle cx="16" cy="38" r="4" />
      <circle cx="32" cy="38" r="4" />
      <path d="M8 24h32" />
      <path d="M16 12V8M32 12V8" />
    </svg>
  ),
};

// বর্তমান অবস্থা - Current Reality in Bengali
function GardenView({ data, voters }: { data: DevelopmentData; voters: number }) {
  const standards = {
    healthcare: 10000,
    education: 2000,
    finance: 15000,
    commerce: 5000,
    transport: 50000,
  };

  const sectors = [
    {
      icon: DevIcons.healthcare,
      label: 'স্বাস্থ্যসেবা',
      have: data.categories.healthcare.count,
      need: Math.ceil(voters / standards.healthcare),
    },
    {
      icon: DevIcons.education,
      label: 'শিক্ষা',
      have: data.categories.education.count,
      need: Math.ceil(voters / standards.education),
    },
    {
      icon: DevIcons.finance,
      label: 'ব্যাংকিং',
      have: data.categories.finance.count,
      need: Math.ceil(voters / standards.finance),
    },
    {
      icon: DevIcons.commerce,
      label: 'বাণিজ্য',
      have: data.categories.commerce.count,
      need: Math.ceil(voters / standards.commerce),
    },
    {
      icon: DevIcons.transport,
      label: 'যাতায়াত',
      have: data.categories.transport.count,
      need: Math.ceil(voters / standards.transport),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sector cards */}
      <div className="space-y-3">
        {sectors.map((sector, idx) => {
          const fillPct = Math.min(100, Math.round((sector.have / sector.need) * 100));
          const isGood = fillPct >= 80;
          const isMedium = fillPct >= 50 && fillPct < 80;

          return (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-slate-800/30 border border-white/5 overflow-hidden"
            >
              {/* Progress fill */}
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-700 ${
                  isGood ? 'bg-emerald-500/10' : isMedium ? 'bg-amber-500/10' : 'bg-red-400/10'
                }`}
                style={{ width: `${fillPct}%` }}
              />

              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 p-2 rounded-xl ${
                  isGood ? 'text-emerald-400 bg-emerald-500/10' :
                  isMedium ? 'text-amber-400 bg-amber-500/10' :
                  'text-red-400 bg-red-400/10'
                }`}>
                  {sector.icon}
                </div>

                {/* Label and stats */}
                <div className="flex-1">
                  <p className="text-white font-medium">{sector.label}</p>
                  <p className="text-sm text-slate-500">
                    আছে <span className={isGood ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-red-400'}>{sector.have}</span>টি
                    {' · '}
                    দরকার <span className="text-slate-300">{sector.need}</span>টি
                  </p>
                </div>

                {/* Status */}
                <div className={`text-right ${
                  isGood ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {isGood ? (
                    <span className="text-sm">✓ পর্যাপ্ত</span>
                  ) : (
                    <span className="text-sm">+{sector.need - sector.have} প্রয়োজন</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>পর্যাপ্ত</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>মাঝামাঝি</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span>অপ্রতুল</span>
        </div>
      </div>

      <p className="text-center text-slate-600 text-sm mt-4">
        &quot;উন্নয়ন যেখানে থেমে আছে, সেখানেই সুযোগ&quot;
      </p>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 100000) return `${(num / 100000).toFixed(1)} লক্ষ`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} হাজার`;
  return num.toString();
}
