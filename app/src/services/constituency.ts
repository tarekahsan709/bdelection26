import { slugify } from '@/lib/url-utils';

import type {
  Candidate,
  ConstituencyPageData,
  ConstituencyPopulation,
  ConstituencyPopulationJson,
  InfrastructureData,
  InfrastructureJson,
} from '@/types/constituency';

interface ConstituencyParams {
  divisionSlug: string;
  districtSlug: string;
  constituencySlug: string;
}

async function fetchPopulation(
  params: ConstituencyParams,
): Promise<ConstituencyPopulation | null> {
  const response = await fetch('/data/constituency-voters-2025.json');
  const json: ConstituencyPopulationJson = await response.json();

  return (
    json.constituencies.find(
      (c) =>
        slugify(c.division_english) === params.divisionSlug &&
        slugify(c.district_english) === params.districtSlug &&
        slugify(c.name_english) === params.constituencySlug,
    ) || null
  );
}

async function fetchInfrastructure(
  constituencyId: string,
): Promise<InfrastructureData | null> {
  const response = await fetch('/data/constituency-infrastructure.json');
  const json: InfrastructureJson = await response.json();

  return (
    json.constituencies.find((c) => c.constituency_id === constituencyId) ||
    null
  );
}

interface CandidateSource {
  url: string;
  partyKey: string;
  filterAllocated?: boolean;
}

const CANDIDATE_SOURCES: CandidateSource[] = [
  { url: '/data/bnp_candidates.json', partyKey: 'BNP', filterAllocated: true },
  { url: '/data/juib_candidates.json', partyKey: 'JUIB' },
  { url: '/data/jamat_candidate.json', partyKey: 'Jamaat' },
  { url: '/data/ncp_candidates.json', partyKey: 'NCP' },
];

async function fetchCandidatesFromSource(
  source: CandidateSource,
  constituencyId: number,
): Promise<Candidate[]> {
  try {
    const response = await fetch(source.url);
    const data = await response.json();
    const candidates = data.candidates || [];

    return candidates
      .filter((c: Candidate) => {
        if (c.constituency_id !== constituencyId) return false;
        if (source.filterAllocated && c.allocated_to) return false;
        return true;
      })
      .map((c: Candidate) => ({ ...c, party: source.partyKey }));
  } catch {
    return [];
  }
}

async function fetchCandidates(constituencyId: string): Promise<Candidate[]> {
  const numericId = parseInt(constituencyId, 10);

  const results = await Promise.all(
    CANDIDATE_SOURCES.map((source) =>
      fetchCandidatesFromSource(source, numericId),
    ),
  );

  return results.flat();
}

export async function fetchConstituencyData(
  params: ConstituencyParams,
): Promise<ConstituencyPageData> {
  const population = await fetchPopulation(params);

  if (!population) {
    return { population: null, infrastructure: null, candidates: [] };
  }

  const [infrastructure, candidates] = await Promise.all([
    fetchInfrastructure(population.id),
    fetchCandidates(population.id),
  ]);

  return { population, infrastructure, candidates };
}
