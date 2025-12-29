# Bangladesh Election Map

## Project Vision

A world-class, interactive election visualization platform for Bangladesh inspired by [The Pudding's](https://pudding.cool) storytelling approach and [GE Dot Map](https://github.com/PaulC91/gedotmap) voter density visualization. The goal is to show voter density and party diversity at a single glance across 300 parliamentary constituencies.

## What We're Building

An interactive dot-density map where:

- Each dot represents ~10,000 voters
- Dots are color-coded by political party
- Users can filter by Division → District → Constituency
- Clicking zooms into regions with detailed candidate information
- Sidebar shows real-time statistics and party distribution charts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Map**: Leaflet with dark CartoDB tiles
- **Data**: Static JSON files in `/app/public/data/`

## Project Structure

```
bangladesh-election/
├── app/                          # Next.js application
│   ├── public/data/              # JSON data files for the app
│   ├── src/
│   │   ├── app/page.tsx          # Main page with map + sidebar
│   │   ├── components/
│   │   │   ├── map/              # Leaflet map components
│   │   │   └── sidebar/          # Sidebar with filters & charts
│   │   └── styles/globals.css    # Global styles + Leaflet overrides
│   └── package.json
│
└── data/                         # Source data files (not served)
    ├── geojson/                  # Geographic boundaries
    │   ├── bangladesh.geojson    # 463 upazila polygons
    │   ├── bd-divisions.json     # 8 divisions
    │   ├── bd-districts.json     # 64 districts
    │   ├── bd-upazilas.json      # 494 upazilas
    │   └── bd-unions.json        # 4540 unions
    ├── bd-constituencies.json    # 300 constituencies with voter data
    ├── bnp_candidates.json       # 300 BNP candidates
    ├── jamat_candidate.json      # 39 Jamaat candidates (2008 data)
    └── political_parties.json    # Party metadata
```

## Data Schemas

### Constituency (`bd-constituencies.json`)

```typescript
interface Constituency {
  id: string;
  name: string; // Bengali name
  name_english: string; // e.g., "Dhaka-1"
  division_id: string;
  division: string;
  division_english: string;
  district_id: string;
  district: string;
  district_english: string;
  areas: Area[]; // Upazilas/wards in this constituency
  registered_voters?: number; // From DBpedia (291/300 have data)
  lat?: number;
  long?: number;
}
```

### Candidate

```typescript
interface Candidate {
  candidate_id: number;
  serial: number;
  constituency_id: number;
  constituency: string;
  constituency_english: string;
  division_id: string;
  district_id: string;
  candidate_name?: string; // Bengali
  candidate_name_english?: string;
  election_year?: number;
}
```

### Party Colors

```typescript
const PARTY_COLORS = {
  BNP: '#00a651', // Green
  Jamaat: '#ff6b35', // Orange
  NCP: '#8b5cf6', // Violet
  JUIB: '#22c55e', // Green (alliance)
  Independent: '#9b59b6',
};
```

## Administrative Hierarchy

```
Division (বিভাগ) - 8 total
  └── District (জেলা) - 64 total
      └── Upazila (উপজেলা) - 494 total
          └── Union (ইউনিয়ন) - 4540 total

Parliamentary Constituencies: 300 (don't align exactly with admin boundaries)
City Corporations: 12 (have wards instead of unions)
```

## Key Design Decisions

### Dot Density Visualization

- Each constituency generates dots based on voter count: `Math.floor(voters / 10000)`
- Dots are randomly distributed within a radius of the constituency center
- Party color is applied to dots where that party has a candidate

### Map Interaction

- Dark theme using CartoDB `dark_all` tiles
- Bounded to Bangladesh coordinates
- Click to zoom + show constituency details
- Hover shows tooltip with constituency name
- Filter by division/district updates map bounds

### Sidebar

- Division → District cascading dropdowns
- Stats update in real-time based on filter
- Bar chart shows party candidate distribution
- All Divisions shows national totals

## Current Data Status

| Data                | Count   | Status                |
| ------------------- | ------- | --------------------- |
| Constituencies      | 300     | Complete              |
| Voter counts        | 291/300 | 97% complete          |
| BNP candidates      | 300     | Complete              |
| Jamaat candidates   | 39      | 2008 election data    |
| Division boundaries | 8       | Complete              |
| District boundaries | 64      | Complete              |
| Upazila polygons    | 463     | In bangladesh.geojson |

### Missing Data Needed

- NCP candidates (real data - 125/300 complete)
- Actual election results (vote counts per party per constituency)
- 9 constituency voter counts still missing

## Development Commands

```bash
cd app
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Future Features

1. **Scrollytelling Mode**: Guided narrative through election data (like The Pudding)
2. **Historical Comparison**: Compare 2008, 2014, 2018, 2024 elections
3. **Constituency Profiles**: Detailed page per constituency
4. **Search**: Find candidate or constituency by name
5. **Mobile Responsive**: Collapsible sidebar on mobile
6. **Actual Vote Data**: Show election results, not just candidates

## Code Conventions

- Use `'use client'` for components with Leaflet (SSR not supported)
- Dynamic import Leaflet components with `ssr: false`
- Keep data fetching in components, not API routes (static JSON)
- Use Tailwind for all styling, avoid inline styles except for dynamic values
- Bengali text should always have English fallback

## Common Issues

### Leaflet SSR Error

Leaflet requires `window` object. Always use dynamic import:

```typescript
const Map = dynamic(() => import('./Map'), { ssr: false });
```

### Constituency ID Matching

Constituency IDs are strings in some files, numbers in others. Always use:

```typescript
parseInt(constituency.id) === candidate.constituency_id;
```

### Bengali Text Encoding

All JSON files use UTF-8. Bengali names are in `name`/`bn_name` fields, English in `name_english`.
