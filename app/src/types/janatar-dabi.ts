export type IssueType =
  | 'mosquitos'
  | 'water_logging'
  | 'traffic'
  | 'extortion'
  | 'bad_roads'
  | 'load_shedding';

export interface IssueConfig {
  icon: string;
  label: string;
  labelEn: string;
  color: string;
}

export type IssueVotes = Record<IssueType, number>;

export interface ConstituencyVotes {
  [constituencyId: string]: IssueVotes;
}

export interface JanatarDabiData {
  metadata: {
    created_at: string;
    description: string;
  };
  constituencies: ConstituencyVotes;
}

export interface VoteRequest {
  constituency_id: string;
  issue: IssueType;
}

export interface VoteResponse {
  success: boolean;
  votes: IssueVotes;
  message?: string;
}

export const ISSUES: Record<IssueType, IssueConfig> = {
  mosquitos: {
    icon: '🦟',
    label: 'মশা/ডেঙ্গু',
    labelEn: 'Mosquitos/Dengue',
    color: '#ef4444',
  },
  water_logging: {
    icon: '🌊',
    label: 'জলাবদ্ধতা',
    labelEn: 'Water Logging',
    color: '#3b82f6',
  },
  traffic: {
    icon: '🚦',
    label: 'যানজট',
    labelEn: 'Traffic Jam',
    color: '#f59e0b',
  },
  extortion: {
    icon: '💸',
    label: 'চাঁদাবাজি',
    labelEn: 'Extortion',
    color: '#8b5cf6',
  },
  bad_roads: {
    icon: '🛣️',
    label: 'ভাঙা রাস্তা',
    labelEn: 'Bad Roads',
    color: '#6b7280',
  },
  load_shedding: {
    icon: '💡',
    label: 'বিদ্যুৎ সমস্যা',
    labelEn: 'Load Shedding',
    color: '#eab308',
  },
};

export const ISSUE_KEYS: IssueType[] = [
  'mosquitos',
  'water_logging',
  'traffic',
  'extortion',
  'bad_roads',
  'load_shedding',
];
