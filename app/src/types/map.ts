import type { LatLngBounds } from 'leaflet';

export interface MapState {
  zoom: number;
  center: [number, number];
  bounds: LatLngBounds | null;
}

export interface FilterState {
  divisionId: string | null;
  districtId: string | null;
}
