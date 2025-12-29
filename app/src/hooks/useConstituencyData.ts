'use client';

import { useEffect, useMemo, useState } from 'react';

import { fetchConstituencyData } from '@/services/constituency';

import type { ConstituencyPageData } from '@/types/constituency';

interface UseConstituencyDataParams {
  divisionSlug: string;
  districtSlug: string;
  constituencySlug: string;
}

interface UseConstituencyDataResult extends ConstituencyPageData {
  loading: boolean;
}

export function useConstituencyData({
  divisionSlug,
  districtSlug,
  constituencySlug,
}: UseConstituencyDataParams): UseConstituencyDataResult {
  const [data, setData] = useState<ConstituencyPageData>({
    population: null,
    infrastructure: null,
    candidates: [],
  });
  const [loading, setLoading] = useState(true);

  const params = useMemo(
    () => ({ divisionSlug, districtSlug, constituencySlug }),
    [divisionSlug, districtSlug, constituencySlug],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const result = await fetchConstituencyData(params);
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch {
        // Handle error silently
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [params]);

  return { ...data, loading };
}
