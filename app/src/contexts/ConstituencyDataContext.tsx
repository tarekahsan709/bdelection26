'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

interface Division {
  id: string;
  name: string;
  bn_name: string;
}

interface District {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
}

interface VoterMetadata {
  male_voters: number;
  female_voters: number;
  total_voters: number;
}

interface ConstituencyDataContextValue {
  constituencies: ConstituencyInfo[];
  divisions: Division[];
  districts: District[];
  metadata: VoterMetadata | null;
  loading: boolean;
}

const ConstituencyDataContext = createContext<ConstituencyDataContextValue>({
  constituencies: [],
  divisions: [],
  districts: [],
  metadata: null,
  loading: true,
});

export function useConstituencyData() {
  return useContext(ConstituencyDataContext);
}

interface ProviderProps {
  children: ReactNode;
}

export function ConstituencyDataProvider({ children }: ProviderProps) {
  const [constituencies, setConstituencies] = useState<ConstituencyInfo[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [metadata, setMetadata] = useState<VoterMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const [votersRes, divisionsRes, districtsRes] = await Promise.all([
          fetch('/data/constituency-voters-2025.json', {
            signal: controller.signal,
            next: { revalidate: 3600 },
          } as RequestInit),
          fetch('/data/bd-divisions.json', {
            signal: controller.signal,
            next: { revalidate: 3600 },
          } as RequestInit),
          fetch('/data/bd-districts.json', {
            signal: controller.signal,
            next: { revalidate: 3600 },
          } as RequestInit),
        ]);

        const [votersData, divisionsData, districtsData] = await Promise.all([
          votersRes.json(),
          divisionsRes.json(),
          districtsRes.json(),
        ]);

        setConstituencies(votersData.constituencies || []);
        setMetadata({
          male_voters: votersData.metadata?.male_voters || 0,
          female_voters: votersData.metadata?.female_voters || 0,
          total_voters: votersData.statistics?.total_voters || 0,
        });
        setDivisions(divisionsData.divisions || []);
        setDistricts(districtsData.districts || []);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setConstituencies([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, []);

  return (
    <ConstituencyDataContext.Provider
      value={{ constituencies, divisions, districts, metadata, loading }}
    >
      {children}
    </ConstituencyDataContext.Provider>
  );
}
