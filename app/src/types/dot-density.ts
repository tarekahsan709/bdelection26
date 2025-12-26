export type DataMode = 'voters' | 'population';

export interface Dot {
  lat: number;
  lng: number;
  c_id: string; // constituency_id (abbreviated for smaller file size)
  d_id: string; // division_id for multi-color rendering
  u: boolean; // urban (abbreviated for smaller file size)
}

export interface DotDensityData {
  data_type: DataMode;
  dot_ratio: number;
  total_dots: number;
  generated_at: string;
  dots: Dot[];
}
