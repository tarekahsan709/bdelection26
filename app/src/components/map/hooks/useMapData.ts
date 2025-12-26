'use client';

import { useState, useEffect } from 'react';
import type { Dot, DotDensityData } from '@/types/dot-density';

export function useMapData(dataMode: 'voters' | 'population') {
  const [dots, setDots] = useState<Dot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDots = async () => {
      setLoading(true);
      setError(null);

      try {
        const filename =
          dataMode === 'voters'
            ? 'dot-density-voters.json'
            : 'dot-density-population.json';

        const response = await fetch(`/data/${filename}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filename}`);
        }

        const data: DotDensityData = await response.json();
        setDots(data.dots);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading dot data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDots();
  }, [dataMode]);

  return { dots, loading, error };
}
