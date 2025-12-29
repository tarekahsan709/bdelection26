'use client';

import { formatVoterCount } from '@/lib/sidebar-utils';
import { useCandidates } from '@/hooks/useCandidates';

import { CloseIcon } from '@/components/icons';

import { PARTY_COLORS } from '@/constants/colors';
import { getConstituencyColor } from '@/constants/divisions';
import { SIDEBAR_TEXT } from '@/constants/sidebar';

import type { ConstituencyInfo } from '@/types/constituency';

// =============================================================================
// Types
// =============================================================================

interface ConstituencyDetailProps {
  constituency: ConstituencyInfo;
  onClose: () => void;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface HeaderProps {
  constituency: ConstituencyInfo;
  onClose: () => void;
}

function Header({ constituency, onClose }: HeaderProps) {
  return (
    <div className='flex items-start justify-between'>
      <div>
        <h3 className='text-lg font-semibold text-white'>
          {constituency.name || constituency.name_english}
        </h3>
        <p className='text-sm text-gray-400'>
          {constituency.district || constituency.district_english},{' '}
          {constituency.division || constituency.division_english}
        </p>
      </div>
      <button
        onClick={onClose}
        className='rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white'
        aria-label='বন্ধ করুন'
      >
        <CloseIcon className='h-5 w-5' />
      </button>
    </div>
  );
}

interface ConstituencyBadgeProps {
  constituencyId: string;
}

function ConstituencyBadge({ constituencyId }: ConstituencyBadgeProps) {
  const color = getConstituencyColor(constituencyId);

  return (
    <div className='flex items-center gap-2'>
      <div
        className='h-3 w-3 rounded-full'
        style={{ backgroundColor: color }}
      />
      <span className='text-sm text-gray-300'>আসন #{constituencyId}</span>
    </div>
  );
}

interface StatsGridProps {
  voterCount: number;
  classification: string;
}

function StatsGrid({ voterCount, classification }: StatsGridProps) {
  return (
    <div className='grid grid-cols-2 gap-3'>
      <div className='rounded-lg bg-gray-800 p-3'>
        <p className='text-xs text-gray-400'>
          {SIDEBAR_TEXT.constituency.registeredVoters}
        </p>
        <p className='text-lg font-semibold text-white'>
          {formatVoterCount(voterCount)}
        </p>
      </div>
      <div className='rounded-lg bg-gray-800 p-3'>
        <p className='text-xs text-gray-400'>
          {SIDEBAR_TEXT.constituency.classification}
        </p>
        <p className='text-lg font-semibold text-white capitalize'>
          {classification || '—'}
        </p>
      </div>
    </div>
  );
}

interface CandidatesSectionProps {
  constituencyId: string;
}

function CandidatesSection({ constituencyId }: CandidatesSectionProps) {
  const { candidates, loading } = useCandidates(constituencyId);

  return (
    <div>
      <h4 className='mb-3 text-sm font-semibold text-gray-300'>
        {SIDEBAR_TEXT.constituency.candidates} ({candidates.length})
      </h4>

      {loading ? (
        <p className='text-sm text-gray-500'>
          {SIDEBAR_TEXT.constituency.loadingCandidates}
        </p>
      ) : candidates.length > 0 ? (
        <div className='space-y-2'>
          {candidates.map((candidate, idx) => (
            <CandidateCard
              key={`${candidate.party}-${candidate.candidate_id || idx}`}
              candidate={candidate}
            />
          ))}
        </div>
      ) : (
        <p className='text-sm text-gray-500'>
          {SIDEBAR_TEXT.constituency.noCandidates}
        </p>
      )}
    </div>
  );
}

interface CandidateCardProps {
  candidate: {
    candidate_name?: string;
    candidate_name_english?: string;
    party: string;
    partyBg: string;
    partyColor: string;
  };
}

function CandidateCard({ candidate }: CandidateCardProps) {
  const partyKey = candidate.party as keyof typeof PARTY_COLORS;
  const partyName = PARTY_COLORS[partyKey]?.name || candidate.party;

  return (
    <div className='rounded-lg bg-gray-800 p-3'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='font-medium text-white'>
            {candidate.candidate_name_english ||
              candidate.candidate_name ||
              'Unknown'}
          </p>
          {candidate.candidate_name && candidate.candidate_name_english && (
            <p className='text-xs text-gray-400'>{candidate.candidate_name}</p>
          )}
        </div>
        <span
          className='ml-2 rounded-full px-2 py-0.5 text-xs font-medium'
          style={{
            backgroundColor: candidate.partyBg,
            color: candidate.partyColor,
          }}
        >
          {partyName}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function ConstituencyDetail({
  constituency,
  onClose,
}: ConstituencyDetailProps) {
  return (
    <div className='space-y-4'>
      <Header constituency={constituency} onClose={onClose} />
      <ConstituencyBadge constituencyId={constituency.id} />
      <StatsGrid
        voterCount={constituency.registered_voters ?? 0}
        classification={constituency.urban_classification}
      />
      <CandidatesSection constituencyId={constituency.id} />
    </div>
  );
}
