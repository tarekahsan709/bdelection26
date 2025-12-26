'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';
import { PARTY_COLORS } from '@/config/colors';

interface Candidate {
  candidate_id: number;
  serial: number;
  constituency_id: number;
  candidate_name?: string;
  candidate_name_english?: string;
  party: string;
  partyColor: string;
  partyBg: string;
}

// Re-export for backward compatibility with proper typing
const PARTY_CONFIG: Record<string, { color: string; bg: string; name: string; fullName: string; fullNameBn: string }> = PARTY_COLORS;

interface CandidatePanelProps {
  constituency: ConstituencyInfo | null;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function CandidatePanel({
  constituency,
  onClose,
  isExpanded,
  onToggleExpand,
}: CandidatePanelProps) {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!constituency) {
      setCandidates([]);
      return;
    }

    const fetchCandidates = async () => {
      setLoading(true);
      const allCandidates: Candidate[] = [];
      const constituencyId = parseInt(constituency.id);

      // Fetch BNP candidates
      try {
        const bnpResponse = await fetch('/data/bnp_candidates.json');
        const bnpData = await bnpResponse.json();
        const bnpCandidates = bnpData.candidates
          .filter((c: { constituency_id: number }) => c.constituency_id === constituencyId)
          .map((c: Candidate) => ({
            ...c,
            party: 'BNP',
            partyColor: PARTY_CONFIG.BNP.color,
            partyBg: PARTY_CONFIG.BNP.bg,
          }));
        allCandidates.push(...bnpCandidates);
      } catch {
        // Silent error
      }

      // Fetch Jamaat candidates
      try {
        const jamaatResponse = await fetch('/data/jamat_candidate.json');
        const jamaatData = await jamaatResponse.json();
        const jamaatCandidates = (jamaatData.candidates || jamaatData)
          .filter((c: { constituency_id: number }) => c.constituency_id === constituencyId)
          .map((c: Candidate) => ({
            ...c,
            party: 'Jamaat',
            partyColor: PARTY_CONFIG.Jamaat.color,
            partyBg: PARTY_CONFIG.Jamaat.bg,
          }));
        allCandidates.push(...jamaatCandidates);
      } catch {
        // Silent error
      }

      // Fetch NCP candidates
      try {
        const ncpResponse = await fetch('/data/ncp_candidates.json');
        const ncpData = await ncpResponse.json();
        const ncpCandidates = ncpData.candidates
          .filter((c: { constituency_id: number }) => c.constituency_id === constituencyId)
          .map((c: Candidate) => ({
            ...c,
            party: 'NCP',
            partyColor: PARTY_CONFIG.NCP.color,
            partyBg: PARTY_CONFIG.NCP.bg,
          }));
        allCandidates.push(...ncpCandidates);
      } catch {
        // Silent error
      }

      setCandidates(allCandidates);
      setLoading(false);
    };

    fetchCandidates();
  }, [constituency]);

  if (!constituency) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 md:left-80 transition-transform duration-300 ease-out ${
        isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-52px)]'
      }`}
      style={{ zIndex: 1000 }}
    >
      {/* Panel container with pure dark glass effect */}
      <div className="bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-white/[0.08] rounded-t-2xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
        {/* Drag handle */}
        <button
          className="w-full py-3 flex justify-center focus:outline-none group"
          onClick={onToggleExpand}
        >
          <div className="w-10 h-1 bg-neutral-600 group-hover:bg-teal-500 rounded-full transition-colors" />
        </button>

        {/* Header */}
        <div className="px-5 pb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-white tracking-tight truncate">
              {constituency.name_english}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {constituency.district_english} · {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-2 text-neutral-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/10" />

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto overscroll-contain">
          {loading ? (
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-5 rounded-xl bg-white/[0.03] animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-white/10 mx-auto mb-3" />
                    <div className="h-4 w-24 bg-white/10 rounded mx-auto mb-2" />
                    <div className="h-5 w-14 bg-white/10 rounded-full mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ) : candidates.length > 0 ? (
            <div className="p-5 space-y-4">
              {/* Candidate cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {candidates.map((candidate, idx) => (
                  <CandidateCard key={`${candidate.party}-${candidate.candidate_id || idx}`} candidate={candidate} />
                ))}
              </div>

              {/* Development Score CTA - Navigate to dedicated page */}
              <button
                className="w-full py-3.5 bg-gradient-to-r from-teal-600/15 to-amber-500/5 hover:from-teal-600/25 hover:to-amber-500/10 border border-teal-600/30 hover:border-teal-500/50 rounded-xl flex items-center justify-center gap-2.5 text-teal-400 transition-all group"
                onClick={() => router.push(`/constituency/${constituency.id}`)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">বিস্তারিত দেখুন</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-600">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">No candidates found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const name = candidate.candidate_name_english || candidate.candidate_name || 'Unknown';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition-all cursor-pointer">
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-base font-semibold shadow-lg"
        style={{
          backgroundColor: candidate.partyBg,
          color: candidate.partyColor,
        }}
      >
        {initials}
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-white text-center leading-tight truncate">
        {name}
      </p>

      {/* Bengali name */}
      {candidate.candidate_name && candidate.candidate_name_english && (
        <p className="text-xs text-neutral-500 text-center truncate mt-0.5">
          {candidate.candidate_name}
        </p>
      )}

      {/* Party badge */}
      <div className="mt-2 flex justify-center">
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: candidate.partyBg,
            color: candidate.partyColor,
          }}
        >
          {PARTY_CONFIG[candidate.party]?.name || candidate.party}
        </span>
      </div>
    </div>
  );
}
