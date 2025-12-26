const fs = require('fs');

// Read source data
const jamat2008 = JSON.parse(fs.readFileSync('./jamat_candidate_2008.json', 'utf8'));
const constituencies = JSON.parse(fs.readFileSync('./bd-constituencies.json', 'utf8'));

// Seat name normalization mapping (2008 format -> our format)
const seatMapping = {
  'Nilfamari-2': 'Nilphamari-2',
  'Nilfamari-3': 'Nilphamari-3',
  'Shirajgonj-4': 'Sirajganj-4',
  'Borguna-2': 'Barguna-2',
  'Bagerhat-4': 'Bagerhat-3',  // Note: Bagerhat now has only 3 seats after 2025, mapping to closest
  "Cox's Bazar-2": "Cox's Bazar-2"  // Apostrophe normalization
};

// Normalize apostrophes and spaces
const normalizeString = (str) => {
  return str.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[''`'\u2019\u2018]/g, "'");  // Normalize all apostrophe types including unicode
};

// Find constituency by English name
const findConstituency = (seatName) => {
  // Normalize the seat name
  const normalizedName = seatMapping[seatName] || seatName;

  return constituencies.constituencies.find(c => {
    return normalizeString(c.name_english) === normalizeString(normalizedName);
  });
};

// Remove duplicates from 2008 data (there's a duplicate Kurigram-4)
const uniqueCandidates = [];
const seenSeats = new Set();
for (const candidate of jamat2008.Worksheet) {
  if (!seenSeats.has(candidate.Seat)) {
    seenSeats.add(candidate.Seat);
    uniqueCandidates.push(candidate);
  }
}

console.log(`Processing ${uniqueCandidates.length} unique candidates from 2008 data...\n`);

// Transform candidates
const transformedCandidates = [];
let matched = 0;
let unmatched = 0;

for (const candidate of uniqueCandidates) {
  const constituency = findConstituency(candidate.Seat);

  if (constituency) {
    matched++;
    transformedCandidates.push({
      candidate_id: transformedCandidates.length + 1,
      serial: parseInt(candidate['Sl.']),
      constituency_id: parseInt(constituency.id),
      constituency: constituency.name,
      constituency_english: constituency.name_english,
      division_id: constituency.division_id,
      division: constituency.division,
      division_english: constituency.division_english,
      district_id: constituency.district_id,
      district: constituency.district,
      district_english: constituency.district_english,
      areas: constituency.areas,
      candidate_name_english: candidate.Name,
      election_year: 2008
    });
    console.log(`✓ ${candidate.Seat} -> ${constituency.name_english}: ${candidate.Name}`);
  } else {
    unmatched++;
    console.log(`✗ ${candidate.Seat}: No matching constituency found`);
  }
}

// Sort by constituency_id
transformedCandidates.sort((a, b) => a.constituency_id - b.constituency_id);

// Reassign candidate_id after sorting
transformedCandidates.forEach((c, i) => c.candidate_id = i + 1);

// Create output
const output = {
  party: "Jamaat-e-Islami",
  party_full_name: "Bangladesh Jamaat-e-Islami",
  party_bengali: "বাংলাদেশ জামায়াতে ইসলামী",
  source: "2008 Election Data",
  document_date: "2008-12-29",
  total_candidates: transformedCandidates.length,
  candidates: transformedCandidates
};

// Write output
fs.writeFileSync('./jamat_candidate.json', JSON.stringify(output, null, 2), 'utf8');

console.log(`\nDone!`);
console.log(`Matched: ${matched}`);
console.log(`Unmatched: ${unmatched}`);
console.log(`Total candidates: ${transformedCandidates.length}`);
console.log(`Saved to jamat_candidate.json`);
