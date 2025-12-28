'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PARTY_COLORS } from '@/config/colors';
import type { Candidate, RawCandidate, PartyCode } from '@/types/candidate';

interface UseCandidatesResult {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PARTY_FILES: { file: string; code: PartyCode; filterAllocated?: boolean }[] = [
  { file: '/data/bnp_candidates.json', code: 'BNP', filterAllocated: true },
  { file: '/data/juib_candidates.json', code: 'JUIB' },
  { file: '/data/jamat_candidate.json', code: 'Jamaat' },
  { file: '/data/ncp_candidates.json', code: 'NCP' },
];

export function useCandidates(constituencyId: number | string | null): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCandidates = useCallback(async () => {
    if (!constituencyId) {
      setCandidates([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const cId = typeof constituencyId === 'string' ? parseInt(constituencyId, 10) : constituencyId;
    if (isNaN(cId)) {
      setCandidates([]);
      return;
    }

    setLoading(true);
    setError(null);

    const allCandidates: Candidate[] = [];
    let hasError = false;

    await Promise.all(
      PARTY_FILES.map(async ({ file, code, filterAllocated }) => {
        try {
          const response = await fetch(file, { signal });
          if (!response.ok) return;

          const data = await response.json();
          const rawCandidates = Array.isArray(data.candidates) ? data.candidates : [];

          const partyCandidates = rawCandidates
            .filter((c: RawCandidate) => {
              if (c.constituency_id !== cId) return false;
              if (filterAllocated && c.allocated_to) return false;
              return true;
            })
            .map(
              (c: RawCandidate): Candidate => ({
                ...c,
                party: code,
                partyColor: PARTY_COLORS[code].color,
                partyBg: PARTY_COLORS[code].bg,
              })
            );

          allCandidates.push(...partyCandidates);
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            hasError = true;
          }
        }
      })
    );

    if (signal.aborted) return;

    allCandidates.sort((a, b) => (a.serial || 0) - (b.serial || 0));
    setCandidates(allCandidates);
    setLoading(false);

    if (hasError && allCandidates.length === 0) {
      setError('Failed to load candidates');
    }
  }, [constituencyId]);

  useEffect(() => {
    fetchCandidates();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCandidates]);

  return { candidates, loading, error, refetch: fetchCandidates };
}
