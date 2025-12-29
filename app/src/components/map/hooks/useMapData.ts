'use client';

import { useEffect, useState } from 'react';

import { DATA_PATHS } from '@/constants/map';

import type { Dot, DotDensityData } from '@/types/dot-density';

type DataMode = 'voters' | 'population';

const DATA_PATH_MAP: Record<DataMode, string> = {
  voters: DATA_PATHS.dotDensityVoters,
  population: DATA_PATHS.dotDensityPopulation,
};

export function useMapData(dataMode: DataMode) {
  const [dots, setDots] = useState<Dot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchDots = async () => {
      setLoading(true);
      setError(null);

      try {
        const path = DATA_PATH_MAP[dataMode];
        const response = await fetch(path, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`ডাটা লোড করতে সমস্যা হয়েছে`);
        }

        const data: DotDensityData = await response.json();
        if (isMounted) {
          setDots(data.dots);
        }
      } catch (err) {
        if (isMounted && (err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'অজানা সমস্যা');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDots();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dataMode]);

  return { dots, loading, error };
}
