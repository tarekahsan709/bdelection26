'use client';

import { useEffect, useState } from 'react';

import { PARTY_COLORS } from '@/constants/colors';
import { DATA_PATHS } from '@/constants/map';

import type { PartyData, RawCandidate } from '@/types/candidate';

export type PartyMap = Map<string, string[]>;

const PARTY_PRIORITY = ['BNP', 'Jamaat', 'JUIB', 'NCP'] as const;

function processParty(
  map: PartyMap,
  data: PartyData,
  partyCode: string,
  filterAllocated = false,
) {
  data.candidates?.forEach((candidate: RawCandidate) => {
    if (filterAllocated && candidate.allocated_to) return;

    const cId = String(candidate.constituency_id);
    const existing = map.get(cId) || [];
    if (!existing.includes(partyCode)) {
      map.set(cId, [...existing, partyCode]);
    }
  });
}

export function usePartyData() {
  const [partyMap, setPartyMap] = useState<PartyMap>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadPartyData = async () => {
      try {
        const [bnpRes, jamaatRes, ncpRes, juibRes] = await Promise.all([
          fetch(DATA_PATHS.bnpCandidates, { signal: controller.signal }),
          fetch(DATA_PATHS.jamaatCandidates, { signal: controller.signal }),
          fetch(DATA_PATHS.ncpCandidates, { signal: controller.signal }),
          fetch(DATA_PATHS.juibCandidates, { signal: controller.signal }),
        ]);

        const [bnpData, jamaatData, ncpData, juibData]: PartyData[] =
          await Promise.all([
            bnpRes.json(),
            jamaatRes.json(),
            ncpRes.json(),
            juibRes.json(),
          ]);

        if (!isMounted) return;

        const map = new Map<string, string[]>();

        processParty(map, bnpData, 'BNP', true);
        processParty(map, jamaatData, 'Jamaat');
        processParty(map, ncpData, 'NCP');
        processParty(map, juibData, 'JUIB');

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

export function getPartyColor(
  partyMap: PartyMap,
  constituencyId: string,
): string {
  const parties = partyMap.get(constituencyId);

  if (!parties || parties.length === 0) {
    return PARTY_COLORS.Independent.color;
  }

  for (const party of PARTY_PRIORITY) {
    if (parties.includes(party)) {
      return (
        PARTY_COLORS[party as keyof typeof PARTY_COLORS]?.color ||
        PARTY_COLORS.Independent.color
      );
    }
  }

  return PARTY_COLORS.Independent.color;
}
