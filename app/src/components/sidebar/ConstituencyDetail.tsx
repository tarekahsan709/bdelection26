'use client';

import { useCandidates } from '@/hooks/useCandidates';

import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

import { PARTY_COLORS } from '@/constants/colors';
import { getConstituencyColor } from '@/constants/divisions';

interface ConstituencyDetailProps {
  constituency: ConstituencyInfo;
  onClose: () => void;
}

export default function ConstituencyDetail({
  constituency,
  onClose,
}: ConstituencyDetailProps) {
  const { candidates, loading } = useCandidates(constituency.id);
  const constituencyColor = getConstituencyColor(constituency.id);
  const count = constituency.registered_voters ?? 0;

  return (
    <div className='space-y-4'>
      {/* Header with close button */}
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-white'>
            {constituency.name_english}
          </h3>
          <p className='text-sm text-gray-400'>
            {constituency.district_english}, {constituency.division_english}
          </p>
        </div>
        <button
          onClick={onClose}
          className='rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white'
          aria-label='Close'
        >
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>

      {/* Constituency badge */}
      <div className='flex items-center gap-2'>
        <div
          className='h-3 w-3 rounded-full'
          style={{ backgroundColor: constituencyColor }}
        />
        <span className='text-sm text-gray-300'>
          Constituency #{constituency.id}
        </span>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-3'>
        <div className='rounded-lg bg-gray-800 p-3'>
          <p className='text-xs text-gray-400'>Registered Voters</p>
          <p className='text-lg font-semibold text-white'>
            {count > 0 ? count.toLocaleString() : '—'}
          </p>
        </div>
        <div className='rounded-lg bg-gray-800 p-3'>
          <p className='text-xs text-gray-400'>Classification</p>
          <p className='text-lg font-semibold text-white capitalize'>
            {constituency.urban_classification || '—'}
          </p>
        </div>
      </div>

      {/* Candidates Section */}
      <div>
        <h4 className='mb-3 text-sm font-semibold text-gray-300'>
          Candidates ({candidates.length})
        </h4>
        {loading ? (
          <p className='text-sm text-gray-500'>Loading candidates...</p>
        ) : candidates.length > 0 ? (
          <div className='space-y-2'>
            {candidates.map((candidate, idx) => (
              <div
                key={`${candidate.party}-${candidate.candidate_id || idx}`}
                className='rounded-lg bg-gray-800 p-3'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <p className='font-medium text-white'>
                      {candidate.candidate_name_english || candidate.candidate_name || 'Unknown'}
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
                    {PARTY_COLORS[candidate.party]?.name || candidate.party}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500'>No candidates found for this constituency</p>
        )}
      </div>
    </div>
  );
}
