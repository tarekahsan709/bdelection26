# Data Strategy & Collection Plan

> This document outlines all data requirements for the Bangladesh Election Platform, categorized by type, source, and collection approach.

## Table of Contents

- [Data Categories](#data-categories)
  - [1. Geographic/Administrative Data](#1-geographicadministrative-data)
  - [2. Constituency Profile Data](#2-constituency-profile-data)
  - [3. Election History Data](#3-election-history-data)
  - [4. Candidate Data](#4-candidate-data)
  - [5. Current MP Data](#5-current-mp-data)
  - [6. Political Party Data](#6-political-party-data)
- [Approach Legend](#approach-legend)
- [Priority Matrix](#priority-matrix)
- [Collection Phases](#collection-phases)
- [Data Sources](#data-sources)
- [Challenges & Mitigations](#challenges--mitigations)

---

## Data Categories

### 1. Geographic/Administrative Data

| Data | Fields Needed | Source | Approach | Difficulty |
|------|---------------|--------|----------|------------|
| Divisions (8) | Name, code, boundaries | Wikipedia/BANBEIS | ✅ Scrape | Easy |
| Districts (64) | Name, division, boundaries | Wikipedia/BBS | ✅ Scrape | Easy |
| Upazilas (~500) | Name, district, boundaries | Wikipedia/BBS | ✅ Scrape | Medium |
| Constituencies (300) | Number, name, district(s), areas covered | EC Website/Wikipedia | ✅ Scrape + Manual | Medium |
| Constituency Boundaries | GeoJSON polygons | EC PDFs / OpenStreetMap | ⚠️ Manual + Trace | **Hard** |
| Upazila → Constituency Mapping | Which upazilas in which constituency | EC Gazette | 📄 Manual from PDF | Medium |

**Key Challenges:**
- Constituency boundaries are only available in EC PDF circulars (no digital format)
- 46 constituencies were redrawn in 16 districts for 2026 election
- Need to maintain both old (pre-2026) and new boundary data

---

### 2. Constituency Profile Data

| Data | Fields Needed | Source | Approach | Difficulty |
|------|---------------|--------|----------|------------|
| Basic Info | Name (BN/EN), number, district | EC/Wikipedia | ✅ Scrape | Easy |
| Population | Total, voter count | BBS Census / EC | 📄 Manual from PDF | Medium |
| Area | Square km | BBS | 📄 Manual | Medium |
| Demographics | Urban/rural %, literacy, occupation | BBS Census 2022 | 📄 Manual from PDF | Hard |
| Major Areas | Towns, notable places | Wikipedia/Local sources | 🌐 Crowdsource + Manual | Medium |
| Key Issues | Local problems, development needs | News/Reports | 🔍 Research | Hard |

**Key Challenges:**
- BBS Census data is in PDF format with Bangla text
- Demographics are at district/upazila level, need to aggregate for constituencies
- "Key issues" requires qualitative research from news sources

---

### 3. Election History Data

| Data | Fields Needed | Source | Approach | Difficulty |
|------|---------------|--------|----------|------------|
| 2024 Results | Winner, votes, turnout | EC Website | 📄 Manual from PDF | Medium |
| 2018 Results | Winner, runner-up, votes | EC Archive | 📄 Manual from PDF | Medium |
| 2014 Results | (Boycotted by BNP - limited data) | EC Archive | 📄 Manual from PDF | Easy |
| 2008 Results | Full results | EC Archive | 📄 Manual from PDF | Medium |
| 2001 Results | Full results | Wikipedia/Archives | ✅ Scrape Wikipedia | Medium |
| Historical Trends | Party dominance, swing analysis | Calculated | 🤖 Auto-generate | Easy |

**Key Challenges:**
- EC archives older elections in hard-to-access formats
- 2014 election was boycotted, data is incomplete
- Need to normalize party names across years (parties merge, split, rename)

---

### 4. Candidate Data

| Data | Fields Needed | Source | Approach | Difficulty |
|------|---------------|--------|----------|------------|
| Basic Info | Name (BN/EN), photo, party, symbol | EC Nomination Papers | 📄 Manual from PDF | Medium |
| Education | Degrees, institutions | Affidavit / News | 📄 Manual + 🔍 Research | Hard |
| Profession | Occupation, business interests | Affidavit / News | 📄 Manual + 🔍 Research | Hard |
| Age/DOB | Date of birth | Affidavit | 📄 Manual | Medium |
| Assets | Wealth declaration | EC Affidavit | 📄 Manual from PDF | Medium |
| Liabilities | Loans, debts | EC Affidavit | 📄 Manual from PDF | Medium |
| Criminal Cases | Pending cases, convictions | EC Affidavit / News | 📄 Manual + 🔍 Research | Hard |
| Political History | Past positions, previous elections | News / Wikipedia | 🔍 Research | Hard |
| Contact | Email, phone, social media | Campaign / Party websites | 🔍 Research | Medium |

**Key Challenges:**
- Candidate affidavits are scanned PDFs in Bangla
- Asset declarations may be incomplete or inaccurate
- Verification of criminal cases requires legal records access
- Photos may not be standardized

---

### 5. Current MP Data

| Data | Fields Needed | Source | Approach | Difficulty |
|------|---------------|--------|----------|------------|
| MP Profile | Name, photo, constituency | Parliament.gov.bd | ✅ Scrape | Easy |
| Contact Info | Office address, email, phone | Parliament.gov.bd | ✅ Scrape | Easy |
| Parliament Attendance | Attendance percentage | Parliament records | 📄 Manual / RTI | Hard |
| Bills/Motions | Bills proposed, motions raised | Parliament records | 📄 Manual | Hard |
| Committee Memberships | Standing committees | Parliament.gov.bd | ✅ Scrape | Medium |
| Speeches | Parliament speeches | Parliament Hansard | 📄 Manual | Hard |

**Key Challenges:**
- Parliament attendance is not publicly published in accessible format
- May require RTI (Right to Information) requests
- Hansard (parliament records) is in Bangla PDFs

---

### 6. Political Party Data

| Data | Fields Needed | Source | Approach | Difficulty |
|------|---------------|--------|----------|------------|
| Party Info | Name (BN/EN), symbol, logo, color | EC / Wikipedia | ✅ Scrape | Easy |
| Leadership | Chairman, General Secretary, key leaders | Party websites / News | 🔍 Research | Medium |
| Manifesto | Election promises, key policies | Party websites | 🔍 Research | Medium |
| History | Founded date, ideology, alliances | Wikipedia | ✅ Scrape | Easy |
| Registered Status | EC registration number | EC Website | ✅ Scrape | Easy |

**Key Challenges:**
- Many parties don't have official websites
- Manifestos may only be released close to elections
- Party alliances change frequently

---

## Approach Legend

| Symbol | Approach | Description | Tools/Methods |
|--------|----------|-------------|---------------|
| ✅ | **Scrape** | Automated web scraping | Puppeteer, Cheerio, Python BeautifulSoup |
| 📄 | **Manual from PDF** | Extract data from EC/BBS PDFs | OCR (Tesseract), manual entry, crowdsourcing |
| 🔍 | **Research** | News articles, reports, verification | Manual research, news APIs |
| 🤖 | **Auto-generate** | Calculate/derive from other data | Scripts, data processing |
| 🌐 | **Crowdsource** | Community contributions | Verification workflow, moderation |

---

## Priority Matrix

```
                    HIGH VALUE
                         │
          ┌──────────────┼──────────────┐
          │   QUICK      │   CRITICAL   │
          │   WINS       │   PATH       │
          │              │              │
          │ • Divisions  │ • Constitu-  │
          │ • Districts  │   encies     │
          │ • Parties    │ • Candidates │
          │ • MP List    │ • Results    │
LOW EFFORT ──────────────┼────────────── HIGH EFFORT
          │              │              │
          │   SKIP       │   PHASE 2    │
          │   FOR NOW    │              │
          │              │ • GeoJSON    │
          │              │ • Demographics│
          │              │ • MP Perf    │
          └──────────────┼──────────────┘
                         │
                    LOW VALUE
```

### Priority 1: Critical Path (Must Have for MVP)
- [ ] 300 Constituencies basic info
- [ ] 2024 & 2018 Election results
- [ ] Current MPs
- [ ] Major political parties
- [ ] Candidate profiles (for upcoming election)

### Priority 2: Quick Wins (Easy to Get)
- [ ] 8 Divisions
- [ ] 64 Districts
- [ ] Party symbols and logos
- [ ] MP contact information

### Priority 3: Phase 2 (After MVP)
- [ ] Constituency GeoJSON boundaries
- [ ] Detailed demographics
- [ ] MP attendance/performance
- [ ] Historical election data (pre-2008)

---

## Collection Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Establish core geographic and political entity data

| Task | Data | Method | Output |
|------|------|--------|--------|
| 1.1 | Divisions & Districts | Scrape Wikipedia | `divisions.json`, `districts.json` |
| 1.2 | Constituencies list (300) | Scrape Wikipedia + EC | `constituencies.json` |
| 1.3 | Political parties | Scrape Wikipedia + EC | `parties.json` |
| 1.4 | Current MPs | Scrape Parliament.gov.bd | `mps.json` |

**Deliverables:**
- Complete list of all 300 constituencies with basic info
- All registered political parties with symbols
- Current MP for each constituency

---

### Phase 2: Election Data (Week 2-3)

**Goal:** Historical election results for trend analysis

| Task | Data | Method | Output |
|------|------|--------|--------|
| 2.1 | 2024 election results | Manual from EC PDFs | `results_2024.json` |
| 2.2 | 2018 election results | Manual from EC PDFs | `results_2018.json` |
| 2.3 | 2008 election results | Scrape Wikipedia | `results_2008.json` |
| 2.4 | 2001 election results | Scrape Wikipedia | `results_2001.json` |

**Deliverables:**
- Vote counts per candidate per constituency (2024, 2018)
- Winner and runner-up for historical elections
- Voter turnout percentages

---

### Phase 3: Candidate Profiles (Week 3-4)

**Goal:** Detailed candidate information for comparison

| Task | Data | Method | Output |
|------|------|--------|--------|
| 3.1 | Candidate basic info | EC nomination papers | `candidates.json` |
| 3.2 | Candidate assets | EC affidavits | Add to `candidates.json` |
| 3.3 | Education & profession | Research + affidavits | Add to `candidates.json` |
| 3.4 | Criminal records | EC affidavits + news | Add to `candidates.json` |

**Deliverables:**
- Candidate profiles with photos
- Asset declarations
- Educational and professional background

---

### Phase 4: Enhanced Data (Post-MVP)

**Goal:** Rich data for advanced features

| Task | Data | Method | Output |
|------|------|--------|--------|
| 4.1 | Constituency boundaries | Trace from EC maps | `constituencies.geojson` |
| 4.2 | Demographics | BBS Census PDFs | Add to `constituencies.json` |
| 4.3 | MP performance | Parliament records | `mp_performance.json` |
| 4.4 | News integration | News API | Real-time |

---

## Data Sources

### Official Sources

| Source | URL | Data Available | Format |
|--------|-----|----------------|--------|
| Election Commission | ecs.gov.bd | Candidates, results, parties | PDF |
| Parliament | parliament.gov.bd | MPs, committees | HTML |
| BBS (Statistics) | bbs.gov.bd | Census, demographics | PDF |
| Cabinet Division | cabinet.gov.bd | Government info | HTML |

### Secondary Sources

| Source | URL | Data Available | Format |
|--------|-----|----------------|--------|
| Wikipedia (English) | en.wikipedia.org | Constituencies, results | HTML |
| Wikipedia (Bangla) | bn.wikipedia.org | Local details | HTML |
| Prothom Alo | prothomalo.com | News, candidate info | HTML |
| Daily Star | thedailystar.net | News, analysis | HTML |
| bdnews24 | bdnews24.com | News, updates | HTML |

### Open Data Sources

| Source | URL | Data Available | Format |
|--------|-----|----------------|--------|
| OpenStreetMap | openstreetmap.org | Geographic boundaries | GeoJSON |
| HDX | data.humdata.org | Bangladesh admin boundaries | GeoJSON |
| GADM | gadm.org | Administrative boundaries | GeoJSON |

---

## Challenges & Mitigations

### Challenge 1: No Official API

**Problem:** EC and other government sources don't provide APIs

**Mitigation:**
- Build web scrapers for HTML sources
- Use OCR for PDF extraction
- Cache and version control all collected data
- Consider RTI requests for structured data

---

### Challenge 2: Bangla Language Data

**Problem:** Most official documents are in Bangla, OCR accuracy is lower

**Mitigation:**
- Use Bangla-trained OCR models (Google Cloud Vision, Tesseract with Bangla)
- Human verification for critical data
- Maintain both Bangla and English versions
- Transliteration for search functionality

---

### Challenge 3: Boundary Changes for 2026

**Problem:** EC redrawn 46 constituencies in 16 districts

**Mitigation:**
- Version control boundaries (pre-2026, post-2026)
- Clear UI indication of boundary status
- Map both old and new boundaries
- Track which specific constituencies changed

---

### Challenge 4: Data Verification

**Problem:** Cannot verify accuracy of candidate claims

**Mitigation:**
- Always cite sources
- Add "last verified" timestamps
- Crowdsource verification with reputation system
- Disclaimer about data accuracy
- Flag unverified information

---

### Challenge 5: Copyright and Legal

**Problem:** EC data may have usage restrictions

**Mitigation:**
- Check Fair Use provisions
- Cite all sources properly
- Non-commercial use for MVP
- Consult legal counsel before public launch
- Consider partnership with EC

---

## Data Schema (Preview)

See [DATA_SCHEMA.md](./DATA_SCHEMA.md) for detailed TypeScript interfaces.

```typescript
// Core entities
interface Division { id, name_en, name_bn, districts[] }
interface District { id, name_en, name_bn, division_id, constituencies[] }
interface Constituency { id, number, name_en, name_bn, district_ids[], areas[] }
interface Party { id, name_en, name_bn, symbol, logo_url, color }
interface Candidate { id, name_en, name_bn, party_id, constituency_id, ... }
interface ElectionResult { constituency_id, election_year, candidates[], turnout }
interface MP { id, name, constituency_id, party_id, term_start, ... }
```

---

## Next Steps

1. **Set up data collection infrastructure**
   - Create scrapers directory structure
   - Set up data validation schemas
   - Initialize JSON data files

2. **Begin Phase 1 collection**
   - Start with Wikipedia scraping
   - Parallelize manual PDF extraction

3. **Design verification workflow**
   - Define data quality standards
   - Create verification checklist

---

*Last updated: December 2024*
