import { PARTY_COLORS } from '@/config/colors';

// Raw candidate data from JSON files
export interface RawCandidate {
  candidate_id: number;
  serial: number;
  constituency_id: number;
  constituency: string;
  constituency_english: string;
  division_id: string;
  district_id: string;
  candidate_name?: string;
  candidate_name_english?: string;
  election_year?: number;
  allocated_to?: string; // For BNP seats allocated to alliance partners
}

// Candidate with party info (after processing)
export interface Candidate extends RawCandidate {
  party: PartyCode;
  partyColor: string;
  partyBg: string;
}

// Valid party codes
export type PartyCode = keyof typeof PARTY_COLORS;

// Party data structure from JSON
export interface PartyData {
  party: string;
  candidates: RawCandidate[];
}
