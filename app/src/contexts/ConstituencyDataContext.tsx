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

interface CachedData {
  constituencies: ConstituencyInfo[];
  divisions: Division[];
  districts: District[];
  metadata: VoterMetadata | null;
  timestamp: number;
}

interface ConstituencyDataContextValue {
  constituencies: ConstituencyInfo[];
  divisions: Division[];
  districts: District[];
  metadata: VoterMetadata | null;
  loading: boolean;
  isStale: boolean;
}

const CACHE_KEY = 'bd_election_data_v1';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const ConstituencyDataContext = createContext<ConstituencyDataContextValue>({
  constituencies: [],
  divisions: [],
  districts: [],
  metadata: null,
  loading: true,
  isStale: false,
});

export function useConstituencyData() {
  return useContext(ConstituencyDataContext);
}

function getCache(): CachedData | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const data = JSON.parse(cached) as CachedData;
    if (!data.constituencies?.length) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(data: Omit<CachedData, 'timestamp'>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ...data, timestamp: Date.now() }),
    );
  } catch {
    // Quota exceeded or other error
  }
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
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      const cached = getCache();
      const isCacheValid = cached && Date.now() - cached.timestamp < CACHE_TTL;

      if (cached) {
        setConstituencies(cached.constituencies);
        setDivisions(cached.divisions);
        setDistricts(cached.districts);
        setMetadata(cached.metadata);
        setLoading(false);
        setIsStale(!isCacheValid);

        if (isCacheValid) return;
      }

      try {
        const [votersRes, divisionsRes, districtsRes] = await Promise.all([
          fetch('/data/constituency-voters-2025.json', {
            signal: controller.signal,
          }),
          fetch('/data/bd-divisions.json', {
            signal: controller.signal,
          }),
          fetch('/data/bd-districts.json', {
            signal: controller.signal,
          }),
        ]);

        const [votersData, divisionsData, districtsData] = await Promise.all([
          votersRes.json(),
          divisionsRes.json(),
          districtsRes.json(),
        ]);

        const newConstituencies = votersData.constituencies || [];
        const newDivisions = divisionsData.divisions || [];
        const newDistricts = districtsData.districts || [];
        const newMetadata = {
          male_voters: votersData.metadata?.male_voters || 0,
          female_voters: votersData.metadata?.female_voters || 0,
          total_voters: votersData.statistics?.total_voters || 0,
        };

        setConstituencies(newConstituencies);
        setDivisions(newDivisions);
        setDistricts(newDistricts);
        setMetadata(newMetadata);
        setIsStale(false);

        setCache({
          constituencies: newConstituencies,
          divisions: newDivisions,
          districts: newDistricts,
          metadata: newMetadata,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError' && !cached) {
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
      value={{
        constituencies,
        divisions,
        districts,
        metadata,
        loading,
        isStale,
      }}
    >
      {children}
    </ConstituencyDataContext.Provider>
  );
}
