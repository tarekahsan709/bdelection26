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
