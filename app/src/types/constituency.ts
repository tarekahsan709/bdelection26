export interface Constituency {
  id: string;
  name: string;
  name_english: string;
  division_id: string;
  division: string;
  division_english: string;
  district_id: string;
  district: string;
  district_english: string;
  areas: Area[];
  registered_voters?: number;
  lat?: number;
  long?: number;
}

export interface Area {
  type: string;
  name: string;
  name_english: string;
  upazila_id?: string;
}

export interface ConstituencyPopulation {
  id: string;
  name: string;
  name_english: string;
  division_id: string;
  division_english: string;
  district_id: string;
  district_english: string;
  total_population: number;
  registered_voters: number;
  urban_classification: 'urban' | 'rural';
  lat: number;
  long: number;
}

export interface ConstituencyPopulationJson {
  constituencies: ConstituencyPopulation[];
}

export interface Candidate {
  candidate_id: number;
  constituency_id: number;
  candidate_name?: string;
  candidate_name_english?: string;
  party: string;
  allocated_to?: string;
}

export interface InfrastructureData {
  constituency_id: string;
  name_english: string;
  lat: number;
  long: number;
  schools: number;
  hospitals: number;
  clinics: number;
  banks: number;
  markets: number;
  mosques: number;
}

export interface InfrastructureJson {
  constituencies: InfrastructureData[];
}

export interface ConstituencyPageData {
  population: ConstituencyPopulation | null;
  infrastructure: InfrastructureData | null;
  candidates: Candidate[];
}
