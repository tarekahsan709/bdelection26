'use client';

import { useState, useEffect, useMemo } from 'react';
import { PARTY_COLORS } from '@/config/colors';

interface Candidate {
  constituency_id: number;
  candidate_name?: string;
  candidate_name_english?: string;
}

interface CandidateData {
  party: string;
  candidates: Candidate[];
}

export type PartyMap = Map<string, string[]>; // constituency_id -> party codes

export function usePartyData() {
  const [partyMap, setPartyMap] = useState<PartyMap>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartyData = async () => {
      try {
        const [bnpRes, jamaatRes, ncpRes] = await Promise.all([
          fetch('/data/bnp_candidates.json'),
          fetch('/data/jamat_candidate.json'),
          fetch('/data/ncp_candidates.json'),
        ]);

        const [bnpData, jamaatData, ncpData]: CandidateData[] = await Promise.all([
          bnpRes.json(),
          jamaatRes.json(),
          ncpRes.json(),
        ]);

        const map = new Map<string, string[]>();

        // Process each party's candidates
        const processParty = (data: CandidateData, partyCode: string) => {
          data.candidates?.forEach((candidate) => {
            const cId = String(candidate.constituency_id);
            const existing = map.get(cId) || [];
            if (!existing.includes(partyCode)) {
              map.set(cId, [...existing, partyCode]);
            }
          });
        };

        processParty(bnpData, 'BNP');
        processParty(jamaatData, 'Jamaat');
        processParty(ncpData, 'NCP');

        setPartyMap(map);
      } catch (error) {
        console.error('Error loading party data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPartyData();
  }, []);

  return { partyMap, loading };
}

// Get party color for a constituency
export function getPartyColor(partyMap: PartyMap, constituencyId: string): string {
  const parties = partyMap.get(constituencyId);

  if (!parties || parties.length === 0) {
    return PARTY_COLORS.Independent.color;
  }

  // If multiple parties, prioritize: BNP > Jamaat > NCP > Independent
  // This creates a visual hierarchy showing main opposition parties
  const priority = ['BNP', 'Jamaat', 'NCP'];
  for (const party of priority) {
    if (parties.includes(party)) {
      return PARTY_COLORS[party as keyof typeof PARTY_COLORS]?.color || PARTY_COLORS.Independent.color;
    }
  }

  return PARTY_COLORS.Independent.color;
}

// Get all parties in a constituency
export function getConstituencyParties(partyMap: PartyMap, constituencyId: string): string[] {
  return partyMap.get(constituencyId) || [];
}
