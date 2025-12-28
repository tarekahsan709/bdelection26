'use client';

import { PARTY_COLORS } from '@/config/colors';
import { JanatarDabi } from '@/components/janatar-dabi';
import { AreaVideos } from '@/components/meme-pulse';
import { slugify } from '@/lib/url-utils';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ParallaxBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#0c0c0c]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 10% 20%, rgba(13, 148, 136, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 90% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 40%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  );
}

function ParliamentIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 500" fill="none" className={className}>
      <defs>
        <mask id="centerMask">
          <rect x="0" y="0" width="1000" height="500" fill="white" />
          <circle cx="500" cy="195" r="75" fill="black" />
          <circle cx="420" cy="95" r="22" fill="black" />
          <circle cx="500" cy="85" r="28" fill="black" />
          <circle cx="580" cy="95" r="22" fill="black" />
          <ellipse cx="500" cy="320" rx="55" ry="35" fill="black" />
        </mask>
        <mask id="leftBlockMask">
          <rect x="0" y="0" width="1000" height="500" fill="white" />
          <polygon points="280,70 340,180 220,180" fill="black" />
          <circle cx="280" cy="235" r="50" fill="black" />
        </mask>
        <mask id="rightBlockMask">
          <rect x="0" y="0" width="1000" height="500" fill="white" />
          <polygon points="720,70 780,180 660,180" fill="black" />
          <circle cx="720" cy="235" r="50" fill="black" />
        </mask>
        <pattern id="striations" patternUnits="userSpaceOnUse" width="1000" height="8">
          <line x1="0" y1="4" x2="1000" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        </pattern>
        <linearGradient id="reflectionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g mask="url(#centerMask)">
        <rect x="390" y="55" width="220" height="280" fill="currentColor" opacity="0.35" />
        <rect x="390" y="55" width="220" height="280" fill="url(#striations)" />
        <rect x="390" y="55" width="220" height="280" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>
      <g mask="url(#leftBlockMask)">
        <rect x="180" y="120" width="200" height="215" fill="currentColor" opacity="0.28" />
        <rect x="180" y="120" width="200" height="215" fill="url(#striations)" />
        <rect x="180" y="120" width="200" height="215" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
      </g>
      <g mask="url(#rightBlockMask)">
        <rect x="620" y="120" width="200" height="215" fill="currentColor" opacity="0.28" />
        <rect x="620" y="120" width="200" height="215" fill="url(#striations)" />
        <rect x="620" y="120" width="200" height="215" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
      </g>
      <g>
        <rect x="60" y="200" width="120" height="135" fill="currentColor" opacity="0.2" />
        <rect x="60" y="200" width="120" height="135" fill="url(#striations)" />
        <rect x="60" y="200" width="120" height="135" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
        <rect x="75" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="95" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="115" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="135" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="155" y="220" width="12" height="80" fill="#0c0c0c" />
      </g>
      <g>
        <rect x="820" y="200" width="120" height="135" fill="currentColor" opacity="0.2" />
        <rect x="820" y="200" width="120" height="135" fill="url(#striations)" />
        <rect x="820" y="200" width="120" height="135" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
        <rect x="833" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="853" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="873" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="893" y="220" width="12" height="80" fill="#0c0c0c" />
        <rect x="913" y="220" width="12" height="80" fill="#0c0c0c" />
      </g>
      <rect x="40" y="335" width="920" height="8" fill="currentColor" opacity="0.25" />
      <g opacity="0.4" transform="translate(0, 350) scale(1, -0.4)">
        <rect x="390" y="55" width="220" height="280" fill="url(#reflectionGrad)" />
        <rect x="180" y="120" width="200" height="215" fill="url(#reflectionGrad)" />
        <rect x="620" y="120" width="200" height="215" fill="url(#reflectionGrad)" />
      </g>
      <g stroke="currentColor" opacity="0.1">
        <line x1="100" y1="380" x2="900" y2="380" strokeWidth="0.5" />
        <line x1="150" y1="400" x2="850" y2="400" strokeWidth="0.5" />
        <line x1="200" y1="420" x2="800" y2="420" strokeWidth="0.5" />
        <line x1="250" y1="440" x2="750" y2="440" strokeWidth="0.5" />
      </g>
      <g stroke="currentColor" fill="none" opacity="0.5">
        <circle cx="500" cy="195" r="75" strokeWidth="1" />
        <circle cx="420" cy="95" r="22" strokeWidth="0.8" />
        <circle cx="500" cy="85" r="28" strokeWidth="0.8" />
        <circle cx="580" cy="95" r="22" strokeWidth="0.8" />
        <ellipse cx="500" cy="320" rx="55" ry="35" strokeWidth="0.8" />
        <polygon points="280,70 340,180 220,180" strokeWidth="0.8" />
        <circle cx="280" cy="235" r="50" strokeWidth="0.8" />
        <polygon points="720,70 780,180 660,180" strokeWidth="0.8" />
        <circle cx="720" cy="235" r="50" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

interface Candidate {
  candidate_id: number;
  constituency_id: number;
  candidate_name?: string;
  candidate_name_english?: string;
  party: string;
  allocated_to?: string;
}

interface InfrastructureData {
  constituency_id: string;
  name_english: string;
  lat: number;
  long: number;
  schools: number;
  hospitals: number;
  clinics: number;
  banks: number;
  markets: number;
  mosques: number;
}

interface InfrastructureJson {
  constituencies: InfrastructureData[];
}

interface ConstituencyPopulation {
  id: string;
  name_english: string;
  name: string;
  division_english: string;
  district_english: string;
  registered_voters: number;
  urban_classification: 'urban' | 'rural';
}

const PARTY_CONFIG: Record<string, { color: string; bg: string; name: string; fullName: string; fullNameBn: string }> = PARTY_COLORS;

export default function ConstituencyPage() {
  const params = useParams();
  const router = useRouter();
  const [infrastructure, setInfrastructure] = useState<InfrastructureData | null>(null);
  const [population, setPopulation] = useState<ConstituencyPopulation | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const divisionSlug = params.division as string;
  const districtSlug = params.district as string;
  const constituencySlug = params.constituency as string;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch constituency population data and find by slug match
        const popResponse = await fetch('/data/constituency-voters-2025.json');
        const popJson = await popResponse.json();
        const pop = popJson.constituencies.find(
          (c: ConstituencyPopulation) =>
            slugify(c.division_english) === divisionSlug &&
            slugify(c.district_english) === districtSlug &&
            slugify(c.name_english) === constituencySlug
        );
        setPopulation(pop || null);

        if (!pop) {
          setLoading(false);
          return;
        }

        const constituencyId = pop.id;

        // Fetch infrastructure data
        const infraResponse = await fetch('/data/constituency-infrastructure.json');
        const infraJson: InfrastructureJson = await infraResponse.json();
        const infra = infraJson.constituencies.find(
          (c) => c.constituency_id === constituencyId
        );
        setInfrastructure(infra || null);

        const allCandidates: Candidate[] = [];
        const cId = parseInt(constituencyId);

        try {
          const bnpRes = await fetch('/data/bnp_candidates.json');
          const bnpData = await bnpRes.json();
          const bnp = bnpData.candidates
            .filter((c: Candidate) => c.constituency_id === cId && !c.allocated_to)
            .map((c: Candidate) => ({ ...c, party: 'BNP' }));
          allCandidates.push(...bnp);
        } catch {
          // BNP data not available
        }

        try {
          const juibRes = await fetch('/data/juib_candidates.json');
          const juibData = await juibRes.json();
          const juib = (juibData.candidates || [])
            .filter((c: Candidate) => c.constituency_id === cId)
            .map((c: Candidate) => ({ ...c, party: 'JUIB' }));
          allCandidates.push(...juib);
        } catch {
          // JUIB data not available
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
      } catch {
        // Data load error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [divisionSlug, districtSlug, constituencySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!infrastructure || !population) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">নির্বাচনী এলাকা পাওয়া যায়নি</p>
          <Link href="/" className="text-teal-400 hover:underline">মানচিত্রে ফিরুন</Link>
        </div>
      </div>
    );
  }

  const voters = population.registered_voters || 400000;
  const constituencyId = population.id;

  return (
    <div className="min-h-screen bg-[#0c0c0c] relative overflow-hidden">
      <ParallaxBackground />

      <header className="sticky top-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-neutral-400">{population.name_english}</span>
        </div>
      </header>

      <main className="relative z-10">
        <section className="min-h-[60vh] flex flex-col justify-center px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                  {population.name_english}
                </h1>
                <p className="text-xl md:text-2xl text-neutral-400 mb-6">{population.name}</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300">
                    {population.district_english}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300">
                    {population.division_english}
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20">
                  <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-1">
                    {formatNumber(voters)}
                  </div>
                  <div className="text-lg text-teal-400 font-medium">নিবন্ধিত ভোটার</div>
                  <p className="text-sm text-neutral-500 mt-2">
                    আপনি {formatNumber(voters)} ভোটারের একজন যারা পরবর্তী এমপি নির্বাচন করবেন
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-3xl font-bold text-rose-400">{candidates.length || '—'}</div>
                  <div className="text-sm text-neutral-400">প্রার্থী</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-3xl font-bold text-emerald-400">{infrastructure?.schools || '—'}</div>
                  <div className="text-sm text-neutral-400">বিদ্যালয়</div>
                </div>
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <div className="text-3xl font-bold text-sky-400">{(infrastructure?.hospitals || 0) + (infrastructure?.clinics || 0) || '—'}</div>
                  <div className="text-sm text-neutral-400">স্বাস্থ্য সুবিধা</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-3xl font-bold text-amber-400">{infrastructure?.markets || '—'}</div>
                  <div className="text-sm text-neutral-400">বাজার</div>
                </div>
                <div className="col-span-2 flex items-center justify-center py-4 opacity-20">
                  <ParliamentIllustration className="w-full max-w-xs h-auto text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <JanatarDabi
              constituencyId={constituencyId}
              constituencyName={population?.name_english || `Constituency ${constituencyId}`}
              constituencyNameBn={population?.name}
            />
          </div>
        </section>

        {/* Meme Pulse - What's happening in your area */}
        <section className="py-12 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <AreaVideos
              constituencyName={population?.name_english || `Constituency ${constituencyId}`}
              constituencyNameBn={population?.name}
            />
          </div>
        </section>

        <section className="py-12 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white text-bangla">
                  প্রার্থী
                </h2>
                <p className="text-neutral-500 mt-1 text-bangla-sm">এই নির্বাচনী এলাকায় কারা এমপি পদপ্রার্থী</p>
              </div>
              {candidates.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 text-sm font-medium">
                  {candidates.length} জন প্রার্থী
                </span>
              )}
            </div>

            {candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.map((candidate, idx) => (
                  <CandidateCard key={idx} candidate={candidate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-neutral-400 font-medium text-bangla-sm">প্রার্থীদের তথ্য শীঘ্রই আসছে</p>
                <p className="text-neutral-600 text-sm mt-1">আপডেটের জন্য পরে দেখুন</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  স্থানীয় অবকাঠামো
                </h2>
                <p className="text-neutral-500 mt-1">OpenStreetMap থেকে তথ্য</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <InfraStatCard icon="🏫" value={infrastructure?.schools || 0} label="বিদ্যালয়" color="emerald" />
              <InfraStatCard icon="🏥" value={infrastructure?.hospitals || 0} label="হাসপাতাল" color="rose" />
              <InfraStatCard icon="🏪" value={infrastructure?.clinics || 0} label="ক্লিনিক" color="sky" />
              <InfraStatCard icon="🏦" value={infrastructure?.banks || 0} label="ব্যাংক" color="amber" />
              <InfraStatCard icon="🛒" value={infrastructure?.markets || 0} label="বাজার" color="purple" />
              <InfraStatCard icon="🕌" value={infrastructure?.mosques || 0} label="মসজিদ" color="teal" />
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-sm text-neutral-400">
                <span className="text-white font-medium">প্রতি 10,000 ভোটারে:</span>{' '}
                {infrastructure?.schools ? ((infrastructure.schools / voters) * 10000).toFixed(1) : '—'} বিদ্যালয়,{' '}
                {infrastructure?.hospitals || infrastructure?.clinics
                  ? (((infrastructure.hospitals || 0) + (infrastructure.clinics || 0)) / voters * 10000).toFixed(1)
                  : '—'} স্বাস্থ্য সুবিধা
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    একজন এমপি কী করতে পারেন?
                  </h2>
                  <p className="text-neutral-500 mt-1">আপনার প্রতিনিধির ক্ষমতা সম্পর্কে জানুন</p>
                </div>
                <span className="text-neutral-500 group-open:rotate-180 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>

              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-teal-500/5 border border-teal-500/10">
                  <div className="text-2xl mb-2">🗣️</div>
                  <h3 className="text-white font-semibold mb-1">আপনার প্রতিনিধিত্ব</h3>
                  <p className="text-neutral-400 text-sm">
                    এমপিরা সংসদে আপনার পক্ষে কথা বলেন এবং স্থানীয় প্রয়োজনের পক্ষে সওয়াল করেন।
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="text-white font-semibold mb-1">বাজেটে প্রভাব</h3>
                  <p className="text-neutral-400 text-sm">
                    প্রতি নির্বাচনী এলাকায় উন্নয়ন তহবিল বরাদ্দ হয়। এমপিরা ব্যয়ের অগ্রাধিকার নির্ধারণে প্রভাব রাখেন।
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="text-2xl mb-2">🏗️</div>
                  <h3 className="text-white font-semibold mb-1">প্রকল্প আনা</h3>
                  <p className="text-neutral-400 text-sm">
                    রাস্তা, স্কুল, হাসপাতাল, বিদ্যুৎ - এমপিরা অবকাঠামো প্রকল্প আনতে পারেন।
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-sm text-neutral-400">
                  <span className="text-teal-400 font-medium">বিঃদ্রঃ</span>{' '}
                  এমপিরা 5 বছরের মেয়াদে কাজ করেন। আপনার ভোট এই নির্বাচনী এলাকার দীর্ঘমেয়াদী উন্নয়নে প্রভাব ফেলে।
                </p>
              </div>
            </details>
          </div>
        </section>

        <footer className="py-8 px-4 border-t border-white/5 pb-16">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              মানচিত্রে ফিরুন
            </Link>
            <p className="text-xs text-neutral-600">
              অবকাঠামো তথ্য OpenStreetMap অবদানকারীদের থেকে
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function InfraStatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number;
  label: string;
  color: 'emerald' | 'rose' | 'sky' | 'amber' | 'purple' | 'teal';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

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
    <div className="group relative p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.06] hover:border-white/[0.12] transition-all hover:bg-neutral-900/80">
      <div
        className="absolute top-0 left-6 right-6 h-1 rounded-b-full"
        style={{ backgroundColor: config.color }}
      />
      <div className="pt-4 text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-lg"
          style={{ backgroundColor: config.bg, color: config.color, boxShadow: `0 8px 32px ${config.bg}` }}
        >
          {initials}
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
        {bengaliName && (
          <p className="text-sm text-neutral-500 mb-3">{bengaliName}</p>
        )}
        <div className="inline-flex flex-col items-center">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            {config.name}
          </span>
          <span className="text-xs text-neutral-600 mt-1">{config.fullName}</span>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 100000) return `${(num / 100000).toFixed(1)} লক্ষ`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} হাজার`;
  return num.toString();
}
