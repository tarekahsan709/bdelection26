export const MAP_CENTER = {
  lat: 23.8103,
  lng: 90.4125,
} as const;

export const MAP_BOUNDS = {
  southWest: { lat: 20.5, lng: 88.0 },
  northEast: { lat: 26.7, lng: 92.8 },
} as const;

export const MAP_ZOOM = {
  default: 7,
  min: 6,
  max: 13,
  divisionFocus: 8,
  districtFocus: 9,
} as const;

export const MAP_ANIMATION = {
  flyDurationSeconds: 1.2,
  flyPadding: 50,
} as const;

export const TILE_LAYER = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
} as const;

export const DATA_PATHS = {
  constituencyVoters: '/data/constituency-voters-2025.json',
  constituenciesGeoJson: '/data/constituencies.geojson',
  districtBoundaries: '/data/district-boundaries.json',
  divisions: '/data/bd-divisions.json',
  districts: '/data/bd-districts.json',
  dotDensityVoters: '/data/dot-density-voters.json',
  dotDensityPopulation: '/data/dot-density-population.json',
  bnpCandidates: '/data/bnp_candidates.json',
  jamaatCandidates: '/data/jamat_candidate.json',
  ncpCandidates: '/data/ncp_candidates.json',
  juibCandidates: '/data/juib_candidates.json',
} as const;

export const MOBILE_BREAKPOINT = 768;

export const GESTURE_HINT = {
  cooldownMs: 5000,
  displayMs: 1500,
} as const;

export const PANE_Z_INDEX = {
  constituency: 650,
} as const;

export const BOUNDARY_STYLE = {
  selected: {
    fillColor: '#0d9488',
    color: '#0d9488',
    fillOpacity: 0.25,
    weight: 3,
  },
  hovered: {
    fillColor: '#14b8a6',
    color: '#14b8a6',
    fillOpacity: 0.15,
    weight: 2,
  },
  division: {
    fillColor: '#0d9488',
    color: '#14b8a6',
    fillOpacity: 0.08,
    weight: 2,
    opacity: 0.6,
  },
  inactive: {
    fillColor: 'transparent',
    color: '#374151',
    fillOpacity: 0,
    weight: 0.5,
    opacity: 0.3,
  },
  hidden: {
    fillColor: 'transparent',
    color: 'transparent',
    fillOpacity: 0,
    weight: 0,
    opacity: 0,
  },
} as const;

export const ZOOM_RADIUS = {
  constituency: {
    6: 18,
    7: 22,
    8: 28,
    9: 35,
    10: 45,
    11: 55,
    12: 65,
  },
  dot: {
    6: 0.8,
    7: 1.0,
    8: 1.3,
    9: 1.6,
    10: 2.0,
    11: 2.5,
    12: 3.0,
    13: 3.5,
  },
  dotGlow: {
    6: 2.0,
    7: 2.5,
    8: 3.0,
    9: 3.5,
    10: 4.5,
    11: 5.5,
    12: 6.5,
    13: 7.5,
  },
} as const;

export const SAMPLE_RATE_BY_ZOOM: Record<number, number> = {
  6: 0.08,
  7: 0.12,
  8: 0.25,
  9: 0.45,
  10: 0.65,
  11: 0.85,
  12: 1.0,
};
