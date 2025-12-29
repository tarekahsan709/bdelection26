import { PARTY_COLORS } from '@/constants/colors';

import type { Candidate } from '@/types/constituency';

interface CandidateCardProps {
  candidate: Candidate;
}

type PartyKey = keyof typeof PARTY_COLORS;

const DEFAULT_PARTY_CONFIG = {
  color: '#666',
  bg: 'rgba(100,100,100,0.15)',
  name: 'Unknown',
  fullName: 'Unknown',
};

function getPartyConfig(party: string) {
  if (party in PARTY_COLORS) {
    return PARTY_COLORS[party as PartyKey];
  }
  return { ...DEFAULT_PARTY_CONFIG, name: party, fullName: party };
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const name =
    candidate.candidate_name_english || candidate.candidate_name || 'Unknown';
  const bengaliName =
    candidate.candidate_name && candidate.candidate_name_english
      ? candidate.candidate_name
      : null;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const config = getPartyConfig(candidate.party);

  return (
    <div className='group relative p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.06] hover:border-white/[0.12] transition-all hover:bg-neutral-900/80'>
      <div
        className='absolute top-0 left-6 right-6 h-1 rounded-b-full'
        style={{ backgroundColor: config.color }}
      />
      <div className='pt-4 text-center'>
        <div
          className='w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-lg'
          style={{
            backgroundColor: config.bg,
            color: config.color,
            boxShadow: `0 8px 32px ${config.bg}`,
          }}
        >
          {initials}
        </div>
        <h3 className='text-lg font-semibold text-white mb-1'>{name}</h3>
        {bengaliName && (
          <p className='text-sm text-neutral-500 mb-3'>{bengaliName}</p>
        )}
        <div className='inline-flex flex-col items-center'>
          <span
            className='px-3 py-1 rounded-full text-sm font-medium'
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            {config.name}
          </span>
          <span className='text-xs text-neutral-600 mt-1'>
            {config.fullName}
          </span>
        </div>
      </div>
    </div>
  );
}
