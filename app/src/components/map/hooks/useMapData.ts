'use client';

import { useState, useEffect } from 'react';
import type { Dot, DotDensityData } from '@/types/dot-density';

export function useMapData(dataMode: 'voters' | 'population') {
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
        const filename =
          dataMode === 'voters' ? 'dot-density-voters.json' : 'dot-density-population.json';

        const response = await fetch(`/data/${filename}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filename}`);
        }

        const data: DotDensityData = await response.json();
        if (isMounted) {
          setDots(data.dots);
        }
      } catch (err) {
        if (isMounted && (err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Unknown error');
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
