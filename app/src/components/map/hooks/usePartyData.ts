'use client';

import { useEffect,useState } from 'react';

import { PARTY_COLORS } from '@/constants/colors';

import type { PartyData,RawCandidate } from '@/types/candidate';

export type PartyMap = Map<string, string[]>; // constituency_id -> party codes

export function usePartyData() {
  const [partyMap, setPartyMap] = useState<PartyMap>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadPartyData = async () => {
      try {
        const [bnpRes, jamaatRes, ncpRes, juibRes] = await Promise.all([
          fetch('/data/bnp_candidates.json', { signal: controller.signal }),
          fetch('/data/jamat_candidate.json', { signal: controller.signal }),
          fetch('/data/ncp_candidates.json', { signal: controller.signal }),
          fetch('/data/juib_candidates.json', { signal: controller.signal }),
        ]);

        const [bnpData, jamaatData, ncpData, juibData]: PartyData[] = await Promise.all([
          bnpRes.json(),
          jamaatRes.json(),
          ncpRes.json(),
          juibRes.json(),
        ]);

        if (!isMounted) return;

        const map = new Map<string, string[]>();

        // Process each party's candidates
        const processParty = (data: PartyData, partyCode: string, filterAllocated = false) => {
          data.candidates?.forEach((candidate: RawCandidate) => {
            // Skip BNP candidates that are allocated to alliance partners
            if (filterAllocated && candidate.allocated_to) {
              return;
            }
            const cId = String(candidate.constituency_id);
            const existing = map.get(cId) || [];
            if (!existing.includes(partyCode)) {
              map.set(cId, [...existing, partyCode]);
            }
          });
        };

        processParty(bnpData, 'BNP', true); // Filter out allocated seats
        processParty(jamaatData, 'Jamaat');
        processParty(ncpData, 'NCP');
        processParty(juibData, 'JUIB');

        setPartyMap(map);
      } catch {
        // Silently handle fetch errors
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPartyData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { partyMap, loading };
}

// Get party color for a constituency
export function getPartyColor(partyMap: PartyMap, constituencyId: string): string {
  const parties = partyMap.get(constituencyId);

  if (!parties || parties.length === 0) {
    return PARTY_COLORS.Independent.color;
  }

  // If multiple parties, prioritize: BNP > Jamaat > JUIB > NCP > Independent
  // This creates a visual hierarchy showing main opposition parties
  const priority = ['BNP', 'Jamaat', 'JUIB', 'NCP'];
  for (const party of priority) {
    if (parties.includes(party)) {
      return PARTY_COLORS[party as keyof typeof PARTY_COLORS]?.color || PARTY_COLORS.Independent.color;
    }
  }

  return PARTY_COLORS.Independent.color;
}
