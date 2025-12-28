'use client';

import Link from 'next/link';

import { getConstituencyUrl } from '@/lib/url-utils';
import { useCandidates } from '@/hooks/useCandidates';

import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

import { PARTY_COLORS } from '@/constants/colors';

import type { Candidate } from '@/types/candidate';

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
  const { candidates, loading } = useCandidates(constituency?.id ?? null);

  if (!constituency) return null;

  return (
    <div
      className={`fixed bottom-15 left-0 right-0 md:left-80 transition-transform duration-300 ease-out ${
        isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'
      }`}
      style={{ zIndex: 55, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className='bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-white/8 rounded-t-2xl shadow-2xl'>
        <button
          className='w-full min-h-11 flex items-center justify-center focus:outline-none group'
          onClick={onToggleExpand}
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          <div className='w-10 h-1 bg-neutral-600 group-active:bg-teal-500 rounded-full' />
        </button>
        <div className='px-4 pb-3 flex items-center justify-between gap-3'>
          <div className='min-w-0 flex-1'>
            <h2 className='text-base font-semibold text-white truncate'>
              {constituency.name_english}
            </h2>
            <p className='text-sm text-neutral-500'>
              {constituency.district_english} · {candidates.length} প্রার্থী
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Link
              href={getConstituencyUrl(constituency)}
              className='h-11 flex items-center gap-1.5 px-4 text-sm font-medium text-teal-400 bg-teal-500/10 active:bg-teal-500/20 border border-teal-500/30 rounded-lg'
            >
              <span>বিস্তারিত</span>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </Link>
            <button
              onClick={onClose}
              className='w-11 h-11 flex items-center justify-center text-neutral-500 active:text-white active:bg-white/10 rounded-lg'
              aria-label='Close panel'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>
        <div className='mx-5 h-px bg-white/10' />
        <div className='max-h-[40vh] sm:max-h-[50vh] overflow-y-auto overscroll-contain'>
          {loading ? (
            <div className='p-5'>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='p-5 rounded-xl bg-white/[0.03] animate-pulse'
                  >
                    <div className='w-14 h-14 rounded-full bg-white/10 mx-auto mb-3' />
                    <div className='h-4 w-24 bg-white/10 rounded mx-auto mb-2' />
                    <div className='h-5 w-14 bg-white/10 rounded-full mx-auto' />
                  </div>
                ))}
              </div>
            </div>
          ) : candidates.length > 0 ? (
            <div className='p-3 sm:p-5'>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3'>
                {candidates.map((candidate, idx) => (
                  <CandidateCard
                    key={`${candidate.party}-${candidate.candidate_id || idx}`}
                    candidate={candidate}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-neutral-600'>
              <svg
                className='w-10 h-10 mb-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              <p className='text-sm'>No candidates found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const name =
    candidate.candidate_name_english || candidate.candidate_name || 'Unknown';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className='p-2.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition-all'>
      <div
        className='w-9 h-9 sm:w-12 sm:h-12 rounded-full mx-auto mb-1.5 sm:mb-2 flex items-center justify-center text-xs sm:text-sm font-semibold shadow-lg'
        style={{
          backgroundColor: candidate.partyBg,
          color: candidate.partyColor,
        }}
      >
        {initials}
      </div>
      <p className='text-xs sm:text-sm font-medium text-white text-center leading-tight truncate'>
        {name}
      </p>
      {candidate.candidate_name && candidate.candidate_name_english && (
        <p className='hidden sm:block text-xs text-neutral-500 text-center truncate mt-0.5'>
          {candidate.candidate_name}
        </p>
      )}
      <div className='mt-1.5 sm:mt-2 flex justify-center'>
        <span
          className='px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium'
          style={{
            backgroundColor: candidate.partyBg,
            color: candidate.partyColor,
          }}
        >
          {PARTY_COLORS[candidate.party]?.name || candidate.party}
        </span>
      </div>
    </div>
  );
}
