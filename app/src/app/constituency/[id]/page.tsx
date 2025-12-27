'use client';

import { PARTY_COLORS } from '@/config/colors';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Animated Background with scroll-responsive elements
function ParallaxBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Base solid dark */}
      <div className="absolute inset-0 bg-[#060606]" />

      {/* Gradient orbs that shift with content */}
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

      {/* Subtle grid pattern */}
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

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  );
}

// Voter Crowd Illustration - Line art style showing Bangladeshi voters (Wide version with shadows)
function VoterCrowdIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 320" fill="none" className={className}>
      {/* Definitions for shadows and gradients */}
      <defs>
        <linearGradient id="crowdGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        {/* Shadow filter */}
        <filter id="personShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="currentColor" floodOpacity="0.3" />
        </filter>
        <filter id="lightShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="currentColor" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Ground shadow line */}
      <ellipse cx="600" cy="305" rx="550" ry="15" fill="currentColor" fillOpacity="0.1" />

      {/* === FAR BACKGROUND ROW (very faded) === */}
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15">
        <ellipse cx="80" cy="185" rx="10" ry="8" />
        <line x1="80" y1="193" x2="80" y2="250" />

        <ellipse cx="180" cy="182" rx="9" ry="7" />
        <line x1="180" y1="189" x2="180" y2="248" />

        <ellipse cx="280" cy="180" rx="10" ry="8" />
        <line x1="280" y1="188" x2="280" y2="252" />

        <ellipse cx="380" cy="183" rx="9" ry="7" />
        <line x1="380" y1="190" x2="380" y2="250" />

        <ellipse cx="480" cy="178" rx="10" ry="8" />
        <line x1="480" y1="186" x2="480" y2="248" />

        <ellipse cx="580" cy="180" rx="9" ry="7" />
        <line x1="580" y1="187" x2="580" y2="250" />

        <ellipse cx="680" cy="182" rx="10" ry="8" />
        <line x1="680" y1="190" x2="680" y2="252" />

        <ellipse cx="780" cy="179" rx="9" ry="7" />
        <line x1="780" y1="186" x2="780" y2="248" />

        <ellipse cx="880" cy="183" rx="10" ry="8" />
        <line x1="880" y1="191" x2="880" y2="250" />

        <ellipse cx="980" cy="180" rx="9" ry="7" />
        <line x1="980" y1="187" x2="980" y2="248" />

        <ellipse cx="1080" cy="184" rx="10" ry="8" />
        <line x1="1080" y1="192" x2="1080" y2="252" />

        <ellipse cx="1150" cy="181" rx="9" ry="7" />
        <line x1="1150" y1="188" x2="1150" y2="248" />
      </g>

      {/* === MIDDLE BACKGROUND ROW === */}
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.25" filter="url(#lightShadow)">
        <ellipse cx="50" cy="195" rx="11" ry="9" />
        <line x1="50" y1="204" x2="50" y2="270" />

        <ellipse cx="130" cy="192" rx="12" ry="10" />
        <line x1="130" y1="202" x2="130" y2="272" />

        <ellipse cx="220" cy="190" rx="11" ry="9" />
        <line x1="220" y1="199" x2="220" y2="268" />

        <ellipse cx="320" cy="193" rx="12" ry="10" />
        <line x1="320" y1="203" x2="320" y2="270" />

        <ellipse cx="430" cy="188" rx="11" ry="9" />
        <line x1="430" y1="197" x2="430" y2="268" />

        <ellipse cx="530" cy="191" rx="12" ry="10" />
        <line x1="530" y1="201" x2="530" y2="272" />

        <ellipse cx="630" cy="189" rx="11" ry="9" />
        <line x1="630" y1="198" x2="630" y2="268" />

        <ellipse cx="730" cy="192" rx="12" ry="10" />
        <line x1="730" y1="202" x2="730" y2="270" />

        <ellipse cx="830" cy="190" rx="11" ry="9" />
        <line x1="830" y1="199" x2="830" y2="270" />

        <ellipse cx="930" cy="193" rx="12" ry="10" />
        <line x1="930" y1="203" x2="930" y2="272" />

        <ellipse cx="1030" cy="188" rx="11" ry="9" />
        <line x1="1030" y1="197" x2="1030" y2="268" />

        <ellipse cx="1120" cy="191" rx="12" ry="10" />
        <line x1="1120" y1="201" x2="1120" y2="270" />
      </g>

      {/* === MAIN FOREGROUND PEOPLE === */}

      {/* Person 1 - Man with sign (far left) */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" filter="url(#personShadow)">
        <rect x="30" y="50" width="50" height="40" rx="2" fill="none" />
        <line x1="55" y1="90" x2="55" y2="135" />
        <circle cx="55" cy="150" r="13" />
        <path d="M42 163 L38 245 L72 245 L68 163" />
        <path d="M42 168 L28 210" />
        <path d="M68 168 L80 205" />
        <path d="M48 245 L45 290" />
        <path d="M62 245 L65 290" />
      </g>

      {/* Person 2 - Woman in saree */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" filter="url(#personShadow)">
        <circle cx="120" cy="155" r="12" />
        <path d="M108 167 L104 250 L136 250 L132 167" />
        <path d="M115 172 L108 195 L118 230" strokeWidth="1" />
        <path d="M108 172 L95 200" />
        <path d="M132 172 L142 198" />
        <path d="M115 250 L112 290" />
        <path d="M125 250 L128 290" />
      </g>

      {/* Person 3 - Man in panjabi */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" filter="url(#personShadow)">
        <circle cx="200" cy="148" r="14" />
        <path d="M186 162 L180 250 L220 250 L214 162" />
        <path d="M192 166 L200 176 L208 166" strokeWidth="1" />
        <path d="M186 168 L168 208" />
        <path d="M214 168 L230 205" />
        <path d="M192 250 L188 290" />
        <path d="M208 250 L212 290" />
      </g>

      {/* Person 4 - Woman with child */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" filter="url(#personShadow)">
        <circle cx="290" cy="152" r="13" />
        <path d="M277 165 L272 252 L308 252 L303 165" />
        <path d="M285 170 L278 195 L290 235" strokeWidth="1" />
        <path d="M277 172 L262 205" />
        <path d="M303 172 L315 200" />
        <path d="M282 252 L279 290" />
        <path d="M298 252 L301 290" />
        {/* Child */}
        <circle cx="325" cy="195" r="8" />
        <path d="M320 203 L318 245 L332 245 L330 203" />
        <path d="M323 245 L321 275" />
        <path d="M327 245 L329 275" />
      </g>

      {/* Person 5 - Man with flag */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" filter="url(#personShadow)">
        <line x1="400" y1="40" x2="400" y2="140" />
        <path d="M400 40 L445 58 L400 76" fill="currentColor" fillOpacity="0.2" />
        <circle cx="390" cy="150" r="14" />
        <path d="M376 164 L370 252 L410 252 L404 164" />
        <path d="M395 145 L400 165" strokeWidth="2" />
        <path d="M376 170 L358 205" />
        <path d="M384 252 L380 290" />
        <path d="M396 252 L400 290" />
      </g>

      {/* Person 6 - Elderly woman */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" filter="url(#personShadow)">
        <circle cx="480" cy="155" r="13" />
        <path d="M467 168 L462 255 L498 255 L493 168" />
        <path d="M475 173 L468 200 L480 240" strokeWidth="1" />
        <path d="M467 175 L450 210" />
        <path d="M493 175 L508 208" />
        <path d="M472 255 L469 290" />
        <path d="M488 255 L491 290" />
      </g>

      {/* Person 7 - CENTER MAN (most prominent) */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="1" filter="url(#personShadow)">
        <circle cx="600" cy="140" r="18" />
        <path d="M582 158 L574 258 L626 258 L618 158" />
        <path d="M590 164 L600 176 L610 164" strokeWidth="1.5" />
        <path d="M582 166 L552 205" />
        <path d="M618 166 L648 205" />
        <circle cx="548" cy="208" r="6" strokeWidth="1.2" />
        <circle cx="652" cy="208" r="6" strokeWidth="1.2" />
        <path d="M588 258 L582 300" />
        <path d="M612 258 L618 300" />
      </g>

      {/* Person 8 - Woman with sign */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" filter="url(#personShadow)">
        <rect x="680" y="48" width="50" height="42" rx="2" fill="none" />
        <line x1="705" y1="90" x2="705" y2="138" />
        <circle cx="700" cy="152" r="13" />
        <path d="M687 165 L682 255 L718 255 L713 165" />
        <path d="M693 170 L710 185 L706 220" strokeWidth="1" />
        <path d="M702 140 L705 162" strokeWidth="2" />
        <path d="M687 172 L672 205" />
        <path d="M692 255 L689 290" />
        <path d="M708 255 L711 290" />
      </g>

      {/* Person 9 - Man with glasses */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" filter="url(#personShadow)">
        <circle cx="790" cy="153" r="14" />
        <circle cx="784" cy="151" r="5" strokeWidth="1" />
        <circle cx="796" cy="151" r="5" strokeWidth="1" />
        <line x1="789" y1="151" x2="791" y2="151" />
        <path d="M776 167 L770 255 L810 255 L804 167" />
        <path d="M804 175 L822 192" />
        <line x1="825" y1="188" x2="835" y2="285" strokeWidth="2" />
        <path d="M776 175 L758 210" />
        <path d="M782 255 L778 290" />
        <path d="M798 255 L802 290" />
      </g>

      {/* Person 10 - Young woman */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" filter="url(#personShadow)">
        <circle cx="880" cy="155" r="12" />
        <path d="M872 162 L868 188" strokeWidth="1" />
        <path d="M888 162 L892 185" strokeWidth="1" />
        <path d="M868 167 L863 250 L897 250 L892 167" />
        <path d="M875 172 L870 200" strokeWidth="1" />
        <path d="M868 172 L855 205" />
        <path d="M892 172 L905 202" />
        <path d="M873 250 L870 290" />
        <path d="M887 250 L890 290" />
      </g>

      {/* Person 11 - Man in lungi */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" filter="url(#personShadow)">
        <circle cx="960" cy="150" r="13" />
        <path d="M947 163 L942 210 L978 210 L973 163" />
        <path d="M944 210 L940 255 L980 255 L976 210" fill="none" />
        <path d="M947 168 L932 198" />
        <path d="M973 168 L988 195" />
        <path d="M952 255 L948 290" />
        <path d="M968 255 L972 290" />
      </g>

      {/* Person 12 - Woman with flag */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" filter="url(#personShadow)">
        <line x1="1050" y1="55" x2="1050" y2="145" />
        <path d="M1050 55 L1085 68 L1050 82" fill="currentColor" fillOpacity="0.15" />
        <circle cx="1040" cy="155" r="12" />
        <ellipse cx="1040" cy="145" rx="5" ry="3" />
        <path d="M1028 167 L1023 252 L1057 252 L1052 167" />
        <path d="M1045 150 L1050 168" strokeWidth="2" />
        <path d="M1028 172 L1015 205" />
        <path d="M1033 252 L1030 290" />
        <path d="M1047 252 L1050 290" />
      </g>

      {/* Person 13 - Man at edge */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" filter="url(#lightShadow)">
        <circle cx="1130" cy="158" r="12" />
        <path d="M1118 170 L1114 252 L1146 252 L1142 170" />
        <path d="M1118 175 L1105 208" />
        <path d="M1142 175 L1155 205" />
        <path d="M1124 252 L1121 290" />
        <path d="M1136 252 L1139 290" />
      </g>

      {/* More background silhouettes in gaps */}
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2">
        <ellipse cx="155" cy="200" rx="10" ry="8" />
        <line x1="155" y1="208" x2="155" y2="265" />

        <ellipse cx="245" cy="198" rx="9" ry="7" />
        <line x1="245" y1="205" x2="245" y2="262" />

        <ellipse cx="345" cy="200" rx="10" ry="8" />
        <line x1="345" y1="208" x2="345" y2="265" />

        <ellipse cx="445" cy="197" rx="9" ry="7" />
        <line x1="445" y1="204" x2="445" y2="260" />

        <ellipse cx="545" cy="200" rx="10" ry="8" />
        <line x1="545" y1="208" x2="545" y2="265" />

        <ellipse cx="655" cy="198" rx="9" ry="7" />
        <line x1="655" y1="205" x2="655" y2="262" />

        <ellipse cx="755" cy="200" rx="10" ry="8" />
        <line x1="755" y1="208" x2="755" y2="265" />

        <ellipse cx="845" cy="197" rx="9" ry="7" />
        <line x1="845" y1="204" x2="845" y2="260" />

        <ellipse cx="920" cy="198" rx="10" ry="8" />
        <line x1="920" y1="206" x2="920" y2="262" />

        <ellipse cx="1000" cy="200" rx="9" ry="7" />
        <line x1="1000" y1="207" x2="1000" y2="265" />

        <ellipse cx="1090" cy="198" rx="10" ry="8" />
        <line x1="1090" y1="206" x2="1090" y2="262" />
      </g>
    </svg>
  );
}

// Section Number Badge - Pudding-style
function SectionBadge({ number, color = 'teal' }: { number: string; color?: 'teal' | 'amber' | 'emerald' | 'rose' }) {
  const colors = {
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${colors[color]}`}>
      {number}
    </span>
  );
}

interface Candidate {
  candidate_id: number;
  constituency_id: number;
  candidate_name?: string;
  candidate_name_english?: string;
  party: string;
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

// Re-export for backward compatibility with proper typing
const PARTY_CONFIG: Record<string, { color: string; bg: string; name: string; fullName: string; fullNameBn: string }> = PARTY_COLORS;

export default function ConstituencyPage() {
  const params = useParams();
  const router = useRouter();
  const [infrastructure, setInfrastructure] = useState<InfrastructureData | null>(null);
  const [population, setPopulation] = useState<ConstituencyPopulation | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const constituencyId = params.id as string;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch real OSM infrastructure data
        const infraResponse = await fetch('/data/constituency-infrastructure.json');
        const infraJson: InfrastructureJson = await infraResponse.json();
        const infra = infraJson.constituencies.find(
          (c) => c.constituency_id === constituencyId
        );
        setInfrastructure(infra || null);

        // Fetch constituency population data for names and voter count
        const popResponse = await fetch('/data/constituency-population.json');
        const popJson = await popResponse.json();
        const pop = popJson.constituencies.find(
          (c: ConstituencyPopulation) => c.id === constituencyId
        );
        setPopulation(pop || null);

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
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!infrastructure || !population) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">নির্বাচনী এলাকা পাওয়া যায়নি</p>
          <Link href="/" className="text-teal-400 hover:underline">মানচিত্রে ফিরুন</Link>
        </div>
      </div>
    );
  }

  const voters = population.registered_voters || 400000;
  const votersInLakh = (voters / 100000).toFixed(1);

  return (
    <div className="min-h-screen bg-[#060606] relative overflow-hidden">
      <ParallaxBackground />

      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#060606]/90 backdrop-blur-xl border-b border-white/[0.04]">
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
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            population.urban_classification === 'urban'
              ? 'bg-teal-600/20 text-teal-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {population.urban_classification === 'urban' ? 'শহর' : 'গ্রাম'}
          </span>
        </div>
      </header>

      <main className="relative z-10">

        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION - The Hook (Pudding-style big typography)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="min-h-[70vh] flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
              <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-neutral-300">{population.district_english}, {population.division_english}</span>
            </div>

            {/* Bengali constituency name - large */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {population.name}
            </h1>

            {/* The big number - voter count with crowd illustration */}
            <div className="mb-8 relative">
              {/* Crowd illustration behind the number */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <VoterCrowdIllustration className="w-full max-w-2xl h-auto text-teal-500/30" />
              </div>

              {/* The number overlay */}
              <div className="relative z-10 py-8">
                <div className="text-7xl md:text-9xl font-black bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                  {votersInLakh} লক্ষ
                </div>
                <p className="text-xl md:text-2xl text-neutral-300 mt-3 font-medium">মানুষের কণ্ঠস্বর</p>
              </div>
            </div>

            {/* The hook - emotional message */}
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-xl mx-auto mb-12">
              এই {formatNumber(voters)} ভোটার একজন <span className="text-teal-400 font-semibold">সংসদ সদস্য</span> নির্বাচন করবেন।
              যে ব্যক্তি পরবর্তী ৫ বছর আপনার এলাকার <span className="text-amber-400 font-semibold">ভাগ্য নির্ধারণ</span> করবেন।
            </p>

            {/* Scroll indicator */}
            <div className="animate-bounce">
              <svg className="w-6 h-6 mx-auto text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: প্রার্থীগণ - The Candidates
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge number="১" color="rose" />
              <span className="text-rose-400/80 text-sm font-medium uppercase tracking-wider">চিনুন</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              কারা আপনার <span className="text-rose-400">ভোট চাইছেন</span>?
            </h2>

            <p className="text-neutral-400 text-lg mb-10 max-w-2xl">
              এই প্রার্থীরা আপনার প্রতিনিধি হতে চান। তাদের দল, পটভূমি এবং প্রতিশ্রুতি সম্পর্কে জানুন।
              মনে রাখবেন — <span className="text-white">তারা আপনার কাছে জবাবদিহি করতে বাধ্য</span>।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate, idx) => (
                <CandidateCard key={idx} candidate={candidate} />
              ))}
            </div>

            {candidates.length === 0 && (
              <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <svg className="w-12 h-12 mx-auto text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-neutral-500">প্রার্থীদের তথ্য শীঘ্রই যোগ করা হবে</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: বর্তমান অবস্থা - Current Reality
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge number="২" color="amber" />
              <span className="text-amber-400/80 text-sm font-medium uppercase tracking-wider">দেখুন</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              আপনার এলাকায় এখন <span className="text-amber-400">কী আছে</span>?
            </h2>

            <p className="text-neutral-400 text-lg mb-10 max-w-2xl">
              এই তথ্য OpenStreetMap থেকে সংগ্রহ করা হয়েছে। দেখুন আপনার নির্বাচনী এলাকায়
              জনসংখ্যা অনুযায়ী কোথায় ঘাটতি আছে এবং কোথায় উন্নতি দরকার।
            </p>

            <GardenView infrastructure={infrastructure} voters={voters} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: আপনার ক্ষমতা - Your Power (Civic Education)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-teal-950/10 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge number="৩" color="teal" />
              <span className="text-teal-400/80 text-sm font-medium uppercase tracking-wider">বুঝুন</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              আপনার ভোট কেন <span className="text-teal-400">শক্তিশালী</span>?
            </h2>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-neutral-300 text-lg leading-relaxed mb-8">
                গণতন্ত্রে জনগণই সর্বোচ্চ ক্ষমতার অধিকারী। আপনার একটি ভোট শুধু একটি কাগজের টুকরো নয় —
                এটি আপনার এলাকার <strong className="text-white">স্কুল, হাসপাতাল, রাস্তা, বিদ্যুৎ এবং পানি</strong>র ভবিষ্যৎ নির্ধারণ করে।
              </p>
            </div>

            {/* Key insight cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-10">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">এমপি কাজ করেন আপনার জন্য</h3>
                <p className="text-neutral-400 text-sm">
                  সংসদ সদস্য জনগণের সেবক। তারা আপনার ট্যাক্সের টাকায় বেতন পান এবং আপনার কাছে জবাবদিহি করতে বাধ্য।
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">বাজেট বরাদ্দের ক্ষমতা</h3>
                <p className="text-neutral-400 text-sm">
                  প্রতিটি নির্বাচনী এলাকায় উন্নয়ন বাজেট বরাদ্দ হয়। এমপি সেই অর্থ কোথায় খরচ হবে তা প্রভাবিত করেন।
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">৫ বছরের সুযোগ</h3>
                <p className="text-neutral-400 text-sm">
                  একবার নির্বাচিত হলে এমপি ৫ বছর দায়িত্ব পালন করেন। আপনার সিদ্ধান্ত দীর্ঘমেয়াদী প্রভাব ফেলে।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: এমপির ক্ষমতা - What MP Can Deliver
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <SectionBadge number="৪" color="emerald" />
              <span className="text-emerald-400/80 text-sm font-medium uppercase tracking-wider">জানুন</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              একজন এমপি কী <span className="text-emerald-400">আনতে পারেন</span>?
            </h2>

            <p className="text-neutral-400 text-lg mb-10 max-w-2xl">
              সংসদ সদস্যদের হাতে উন্নয়ন প্রকল্প অনুমোদন, বাজেট বরাদ্দ প্রভাবিত করা এবং
              সরকারি সংস্থাগুলোর সাথে যোগাযোগের ক্ষমতা থাকে। তারা আনতে পারেন:
            </p>

            <SeedsOfChange />

            {/* Educational note */}
            <div className="mt-10 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-semibold mb-2">জানা দরকার</h4>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    এমপি একা সব করতে পারেন না, তবে তারা গুরুত্বপূর্ণ দরজা খুলতে পারেন।
                    একজন সক্রিয় এমপি তার এলাকায় সরকারি প্রকল্প আনতে, আমলাতান্ত্রিক জটিলতা কমাতে
                    এবং জনগণের দাবি সংসদে তুলে ধরতে পারেন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FINAL SECTION: সিদ্ধান্ত - Your Decision
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative p-10 md:p-16 rounded-3xl overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/15 via-emerald-500/10 to-amber-500/15" />
              <div className="absolute inset-0 bg-[#060606]/60" />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)`
                }}
              />

              <div className="relative text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  সিদ্ধান্ত এখন <span className="text-teal-400">আপনার</span>
                </h2>

                <div className="space-y-4 text-neutral-300 text-lg leading-relaxed mb-8">
                  <p>
                    আপনি জানলেন আপনার ভোটের শক্তি।
                  </p>
                  <p>
                    দেখলেন এমপি কী কী আনতে পারেন।
                  </p>
                  <p>
                    বুঝলেন আপনার এলাকার বর্তমান অবস্থা।
                  </p>
                  <p>
                    চিনলেন কারা প্রার্থী।
                  </p>
                </div>

                <div className="py-6 border-y border-white/10 mb-8">
                  <p className="text-2xl md:text-3xl font-bold">
                    <span className="text-teal-400">{formatNumber(voters)}</span> ভোটারের কণ্ঠস্বর
                  </p>
                  <p className="text-neutral-400 mt-2">কার হাতে তুলে দেবেন?</p>
                </div>

                <p className="text-sm text-neutral-500 italic">
                  &quot;গণতন্ত্রে প্রতিটি ভোট গুরুত্বপূর্ণ। আপনার সিদ্ধান্তই আপনার এলাকার ভবিষ্যৎ।&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              মানচিত্রে ফিরুন
            </Link>

            <p className="text-xs text-neutral-600 mb-2">
              তথ্য শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে
            </p>
            <p className="text-xs text-neutral-700">
              অবকাঠামো তথ্য: OpenStreetMap contributors
            </p>
          </div>
        </footer>
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
    <div className="group relative p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.06] hover:border-white/[0.12] transition-all hover:bg-neutral-900/80">
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
          <p className="text-sm text-neutral-500 mb-3">{bengaliName}</p>
        )}

        {/* Party Badge */}
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

// সম্ভাবনার বীজ - MP Powers in Bengali (Enhanced with details)
function SeedsOfChange() {
  const powers = [
    {
      icon: Icons.road,
      label: 'রাস্তাঘাট',
      desc: 'সংযোগের পথ',
      detail: 'গ্রামীণ সড়ক, ব্রিজ, কালভার্ট নির্মাণ ও মেরামত',
      color: 'teal',
    },
    {
      icon: Icons.school,
      label: 'শিক্ষা',
      desc: 'জ্ঞানের আলো',
      detail: 'স্কুল, কলেজ, মাদ্রাসা স্থাপন ও উন্নয়ন',
      color: 'emerald',
    },
    {
      icon: Icons.health,
      label: 'স্বাস্থ্য',
      desc: 'সেবার হাত',
      detail: 'হাসপাতাল, ক্লিনিক, কমিউনিটি স্বাস্থ্যকেন্দ্র',
      color: 'rose',
    },
    {
      icon: Icons.electricity,
      label: 'বিদ্যুৎ',
      desc: 'আলোর দিশা',
      detail: 'বিদ্যুতায়ন প্রকল্প, সোলার প্যানেল বিতরণ',
      color: 'amber',
    },
    {
      icon: Icons.water,
      label: 'পানি',
      desc: 'জীবনের ধারা',
      detail: 'বিশুদ্ধ পানি সরবরাহ, গভীর নলকূপ স্থাপন',
      color: 'sky',
    },
    {
      icon: Icons.home,
      label: 'আবাসন',
      desc: 'নিরাপদ ছাদ',
      detail: 'আশ্রয়ণ প্রকল্প, গৃহহীনদের ঘর প্রদান',
      color: 'purple',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  };

  return (
    <div className="space-y-6">
      {/* Grid of powers - larger cards with more info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {powers.map((power, idx) => {
          const colors = colorClasses[power.color];
          return (
            <div
              key={idx}
              className={`group p-5 rounded-2xl ${colors.bg} border ${colors.border} hover:scale-[1.02] transition-all`}
            >
              <div className={`w-12 h-12 mb-4 p-2.5 rounded-xl bg-white/5 ${colors.text}`}>
                {power.icon}
              </div>
              <h3 className="text-white font-semibold mb-1">{power.label}</h3>
              <p className={`text-xs ${colors.text} mb-2`}>{power.desc}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{power.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Development Icons
// Artistic illustration icons for each sector
const DevIcons = {
  healthcare: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      {/* Hospital building */}
      <rect x="14" y="20" width="36" height="32" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      {/* Cross symbol */}
      <rect x="26" y="8" width="12" height="16" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 12v8M28 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Windows */}
      <rect x="18" y="26" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      <rect x="40" y="26" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      {/* Door */}
      <path d="M28 52V40a4 4 0 018 0v12" stroke="currentColor" strokeWidth="1.5" />
      {/* Doctor figure */}
      <circle cx="50" cy="36" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 40v8M46 44h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Stethoscope hint */}
      <path d="M48 42c-2 2-2 4 0 4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      {/* School building */}
      <path d="M8 28l24-14 24 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="28" width="40" height="24" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      {/* Flag */}
      <path d="M32 8v6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 8h8l-2 3 2 3h-8" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      {/* Door */}
      <path d="M28 52V42a4 4 0 018 0v10" stroke="currentColor" strokeWidth="1.5" />
      {/* Child with book - left */}
      <circle cx="18" cy="44" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 47v5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="48" width="5" height="4" rx="0.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
      {/* Child with book - right */}
      <circle cx="46" cy="44" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M46 47v5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="43" y="48" width="5" height="4" rx="0.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
      {/* Book details */}
      <path d="M15 50h3M44 50h3" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.6" />
    </svg>
  ),
  finance: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      {/* Bank building with columns */}
      <path d="M8 22l24-12 24 12" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="22" width="44" height="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="48" width="44" height="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      {/* Columns */}
      <rect x="14" y="26" width="4" height="22" stroke="currentColor" strokeWidth="1.5" />
      <rect x="24" y="26" width="4" height="22" stroke="currentColor" strokeWidth="1.5" />
      <rect x="36" y="26" width="4" height="22" stroke="currentColor" strokeWidth="1.5" />
      <rect x="46" y="26" width="4" height="22" stroke="currentColor" strokeWidth="1.5" />
      {/* Taka symbol */}
      <circle cx="32" cy="36" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <text x="32" y="40" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">৳</text>
      {/* Coins */}
      <circle cx="52" cy="56" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="56" cy="54" r="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  commerce: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      {/* Market stall roof */}
      <path d="M6 24l6-12h40l6 12" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 24c2 3 4 4 7 4s5-1 7-4c2 3 4 4 7 4s5-1 7-4c2 3 4 4 7 4s5-1 7-4c2 3 4 4 7 4s5-1 6-4" stroke="currentColor" strokeWidth="1.5" />
      {/* Stall structure */}
      <path d="M10 28v22M54 28v22M10 50h44" stroke="currentColor" strokeWidth="1.5" />
      {/* Goods on display */}
      <circle cx="20" cy="40" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="38" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
      <circle cx="44" cy="40" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
      {/* Basket */}
      <path d="M26 46c0-2 4-2 6-2s6 0 6 2v4H26v-4z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
      {/* Person shopping */}
      <circle cx="52" cy="38" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M52 41v7M49 44l3 2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  worship: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      {/* Minaret left */}
      <rect x="8" y="24" width="8" height="28" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 24l4-8 4 8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      {/* Main dome */}
      <path d="M20 32c0-8 6-14 12-18 6 4 12 10 12 18" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="20" y="32" width="24" height="20" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />
      {/* Crescent */}
      <circle cx="32" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="10" r="3" fill="currentColor" fillOpacity="0" stroke="none" />
      <path d="M32 6v-2" stroke="currentColor" strokeWidth="1.5" />
      {/* Door arch */}
      <path d="M28 52V42a4 4 0 018 0v10" stroke="currentColor" strokeWidth="1.5" />
      {/* Minaret right */}
      <rect x="48" y="24" width="8" height="28" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M48 24l4-8 4 8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      {/* Windows */}
      <circle cx="26" cy="38" r="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="38" cy="38" r="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  ),
};

// বর্তমান অবস্থা - Current Reality in Bengali (using real OSM data)
function GardenView({ infrastructure, voters }: { infrastructure: InfrastructureData; voters: number }) {
  // Standards: how many people per facility is reasonable
  const standards = {
    healthcare: 10000,  // 1 hospital/clinic per 10k people
    education: 2000,    // 1 school per 2k people
    finance: 15000,     // 1 bank per 15k people
    commerce: 5000,     // 1 market per 5k people
    worship: 2000,      // 1 mosque per 2k people
  };

  const sectors = [
    {
      icon: DevIcons.healthcare,
      label: 'স্বাস্থ্যসেবা',
      sublabel: 'হাসপাতাল ও ক্লিনিক',
      have: infrastructure.hospitals + infrastructure.clinics,
      need: Math.ceil(voters / standards.healthcare),
      standard: standards.healthcare,
      standardText: 'প্রতি ১০ হাজার জনে ১টি',
      unit: 'হাসপাতাল/ক্লিনিক',
    },
    {
      icon: DevIcons.education,
      label: 'শিক্ষা',
      sublabel: 'বিদ্যালয়',
      have: infrastructure.schools,
      need: Math.ceil(voters / standards.education),
      standard: standards.education,
      standardText: 'প্রতি ২ হাজার জনে ১টি',
      unit: 'বিদ্যালয়',
    },
    {
      icon: DevIcons.finance,
      label: 'ব্যাংকিং',
      sublabel: 'ব্যাংক শাখা',
      have: infrastructure.banks,
      need: Math.ceil(voters / standards.finance),
      standard: standards.finance,
      standardText: 'প্রতি ১৫ হাজার জনে ১টি',
      unit: 'ব্যাংক শাখা',
    },
    {
      icon: DevIcons.commerce,
      label: 'বাণিজ্য',
      sublabel: 'বাজার',
      have: infrastructure.markets,
      need: Math.ceil(voters / standards.commerce),
      standard: standards.commerce,
      standardText: 'প্রতি ৫ হাজার জনে ১টি',
      unit: 'বাজার',
    },
    {
      icon: DevIcons.worship,
      label: 'উপাসনালয়',
      sublabel: 'মসজিদ',
      have: infrastructure.mosques,
      need: Math.ceil(voters / standards.worship),
      standard: standards.worship,
      standardText: 'প্রতি ২ হাজার জনে ১টি',
      unit: 'মসজিদ',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-neutral-400 text-sm leading-relaxed">
          আপনার নির্বাচনী এলাকায় বর্তমানে কী কী সুযোগ-সুবিধা আছে এবং জনসংখ্যা অনুযায়ী
          আরও কতটুকু প্রয়োজন — এই তুলনামূলক চিত্র দেখুন।
        </p>
      </div>

      {/* Sector cards */}
      <div className="space-y-4">
        {sectors.map((sector, idx) => {
          const fillPct = Math.min(100, Math.round((sector.have / sector.need) * 100));
          const isGood = fillPct >= 80;
          const isMedium = fillPct >= 50 && fillPct < 80;
          const gap = sector.need - sector.have;
          const votersInLakh = (voters / 100000).toFixed(1);

          return (
            <div
              key={idx}
              className="relative rounded-xl bg-neutral-900/50 border border-white/[0.06] overflow-hidden"
            >
              {/* Header with icon and main stats */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 p-3 rounded-xl shrink-0 ${
                    isGood ? 'text-emerald-400 bg-emerald-500/10' :
                    isMedium ? 'text-amber-400 bg-amber-500/10' :
                    'text-red-400 bg-red-400/10'
                  }`}>
                    {sector.icon}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{sector.label}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isGood ? 'bg-emerald-500/20 text-emerald-400' :
                        isMedium ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>
                        {fillPct}%
                      </span>
                    </div>

                    {/* Current count - big number */}
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className={`text-3xl font-bold ${
                        isGood ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {sector.have}
                      </span>
                      <span className="text-neutral-500 text-sm">টি {sector.unit} আছে</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isGood ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation breakdown */}
              <div className="px-4 py-3 bg-neutral-900/50 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                  <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>হিসাব</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Standard */}
                  <div className="p-2 rounded-lg bg-neutral-800/50">
                    <p className="text-neutral-600 mb-0.5">মানদণ্ড</p>
                    <p className="text-neutral-300">{sector.standardText}</p>
                  </div>

                  {/* Calculation */}
                  <div className="p-2 rounded-lg bg-neutral-800/50">
                    <p className="text-neutral-600 mb-0.5">গণনা</p>
                    <p className="text-neutral-300">
                      <span className="text-teal-400">{votersInLakh} লক্ষ</span> ÷ {sector.standard / 1000} হাজার = <span className="text-white font-medium">{sector.need}টি</span>
                    </p>
                  </div>

                  {/* Result */}
                  <div className={`p-2 rounded-lg ${
                    isGood ? 'bg-emerald-500/10' : isMedium ? 'bg-amber-500/10' : 'bg-red-400/10'
                  }`}>
                    <p className="text-neutral-600 mb-0.5">ফলাফল</p>
                    {isGood ? (
                      <p className="text-emerald-400 font-medium">✓ পর্যাপ্ত আছে</p>
                    ) : (
                      <p className={isMedium ? 'text-amber-400' : 'text-red-400'}>
                        আরও <span className="font-bold">{gap}টি</span> প্রয়োজন
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>পর্যাপ্ত (৮০%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>মাঝামাঝি (৫০-৮০%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span>অপ্রতুল (&lt;৫০%)</span>
        </div>
      </div>

      <p className="text-center text-neutral-600 text-sm mt-4">
        &quot;উন্নয়ন যেখানে থেমে আছে, সেখানেই সুযোগ&quot;
      </p>

      {/* Data source attribution */}
      <div className="mt-6 pt-4 border-t border-white/[0.04] text-center">
        <a
          href="https://www.openstreetmap.org/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-teal-400 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <span>তথ্যসূত্র: OpenStreetMap</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <p className="text-[10px] text-neutral-600 mt-1">
          © OpenStreetMap contributors
        </p>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 100000) return `${(num / 100000).toFixed(1)} লক্ষ`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} হাজার`;
  return num.toString();
}
