/**
 * Generate Mock Candidate Data for Jamaat and NCP
 *
 * Usage: node scripts/generate-mock-candidates.js
 *
 * This creates mock candidate data for:
 * - Jamaat: Fill remaining 261 seats (39 real + 261 mock = 300)
 * - NCP: All 300 seats (new party)
 */

const fs = require('fs');
const path = require('path');

const CONSTITUENCIES_PATH = path.join(__dirname, '../data/bd-constituencies.json');
const JAMAAT_PATH = path.join(__dirname, '../data/jamat_candidate.json');
const OUTPUT_DIR = path.join(__dirname, '../app/public/data');

// Bengali first names (male)
const FIRST_NAMES_BENGALI = [
  'মোঃ', 'আব্দুল', 'মোহাম্মদ', 'শেখ', 'আলী', 'হাসান', 'হোসেন', 'রহমান',
  'করিম', 'রহিম', 'সালাম', 'আজম', 'নাসির', 'জাহিদ', 'ফরিদ', 'মজিদ',
  'হামিদ', 'সাদিক', 'নাঈম', 'তানভীর', 'ইমরান', 'সোহেল', 'রাসেল', 'সাকিব'
];

const LAST_NAMES_BENGALI = [
  'হক', 'আহমেদ', 'খান', 'চৌধুরী', 'মিয়া', 'সরকার', 'মন্ডল', 'শেখ',
  'ভূঁইয়া', 'তালুকদার', 'মজুমদার', 'বেগম', 'উদ্দিন', 'আলম', 'হোসাইন', 'ইসলাম',
  'রহমান', 'করিম', 'হাসান', 'সিদ্দিকী', 'আনসারী', 'মোল্লা', 'প্রামাণিক', 'মৃধা'
];

// English first names
const FIRST_NAMES_ENGLISH = [
  'Md.', 'Abdul', 'Mohammad', 'Sheikh', 'Ali', 'Hasan', 'Hossain', 'Rahman',
  'Karim', 'Rahim', 'Salam', 'Azam', 'Nasir', 'Zahid', 'Farid', 'Majid',
  'Hamid', 'Sadiq', 'Naeem', 'Tanvir', 'Imran', 'Sohel', 'Rasel', 'Sakib'
];

const LAST_NAMES_ENGLISH = [
  'Haque', 'Ahmed', 'Khan', 'Chowdhury', 'Mia', 'Sarker', 'Mondol', 'Sheikh',
  'Bhuiyan', 'Talukder', 'Mazumder', 'Uddin', 'Alam', 'Hossain', 'Islam',
  'Rahman', 'Karim', 'Hassan', 'Siddiqui', 'Ansari', 'Molla', 'Pramanik', 'Mridha'
];

// Seed random for reproducibility
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateName(seed, type = 'english') {
  const firstNames = type === 'bengali' ? FIRST_NAMES_BENGALI : FIRST_NAMES_ENGLISH;
  const lastNames = type === 'bengali' ? LAST_NAMES_BENGALI : LAST_NAMES_ENGLISH;

  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 1);
  const r3 = seededRandom(seed + 2);

  const firstName = firstNames[Math.floor(r1 * firstNames.length)];
  const middleName = r3 > 0.5 ? firstNames[Math.floor(r2 * firstNames.length)] : '';
  const lastName = lastNames[Math.floor((r2 + r3) / 2 * lastNames.length)];

  return middleName
    ? `${firstName} ${middleName} ${lastName}`
    : `${firstName} ${lastName}`;
}

function main() {
  // Load constituencies
  const constituenciesData = JSON.parse(fs.readFileSync(CONSTITUENCIES_PATH, 'utf8'));
  const constituencies = constituenciesData.constituencies;

  // Load existing Jamaat data
  const jamaatData = JSON.parse(fs.readFileSync(JAMAAT_PATH, 'utf8'));
  const existingJamaatIds = new Set(jamaatData.candidates.map(c => c.constituency_id));

  console.log(`Loaded ${constituencies.length} constituencies`);
  console.log(`Existing Jamaat candidates: ${jamaatData.candidates.length}`);
  console.log(`Missing Jamaat seats: ${300 - jamaatData.candidates.length}\n`);

  // Generate Jamaat candidates for missing seats
  const jamaatCandidates = [...jamaatData.candidates];
  let jamaatId = jamaatData.candidates.length + 1;

  for (const c of constituencies) {
    const cId = parseInt(c.id);
    if (!existingJamaatIds.has(cId)) {
      const seed = cId * 1000 + 1; // Unique seed
      jamaatCandidates.push({
        candidate_id: jamaatId++,
        serial: jamaatId,
        constituency_id: cId,
        constituency: c.name,
        constituency_english: c.name_english,
        division_id: c.division_id,
        division: c.division,
        division_english: c.division_english,
        district_id: c.district_id,
        district: c.district,
        district_english: c.district_english,
        candidate_name: generateName(seed, 'bengali'),
        candidate_name_english: generateName(seed, 'english'),
        election_year: 2024,
        is_mock: true,
      });
    }
  }

  const jamaatOutput = {
    party: 'Jamaat-e-Islami',
    party_full_name: 'Bangladesh Jamaat-e-Islami',
    party_bengali: 'বাংলাদেশ জামায়াতে ইসলামী',
    source: 'Mixed (2008 real data + 2024 mock data)',
    total_candidates: jamaatCandidates.length,
    real_candidates: jamaatData.candidates.length,
    mock_candidates: jamaatCandidates.length - jamaatData.candidates.length,
    candidates: jamaatCandidates,
  };

  // Generate NCP candidates for all 300 seats
  const ncpCandidates = [];
  let ncpId = 1;

  for (const c of constituencies) {
    const cId = parseInt(c.id);
    const seed = cId * 2000 + 2; // Different seed for NCP
    ncpCandidates.push({
      candidate_id: ncpId++,
      serial: ncpId,
      constituency_id: cId,
      constituency: c.name,
      constituency_english: c.name_english,
      division_id: c.division_id,
      division: c.division,
      division_english: c.division_english,
      district_id: c.district_id,
      district: c.district,
      district_english: c.district_english,
      candidate_name: generateName(seed, 'bengali'),
      candidate_name_english: generateName(seed, 'english'),
      election_year: 2024,
      is_mock: true,
    });
  }

  const ncpOutput = {
    party: 'NCP',
    party_full_name: 'National Congress Party',
    party_bengali: 'জাতীয় কংগ্রেস পার্টি',
    source: 'Mock data for demonstration',
    total_candidates: ncpCandidates.length,
    candidates: ncpCandidates,
  };

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'jamat_candidate.json'),
    JSON.stringify(jamaatOutput, null, 2)
  );
  console.log(`Jamaat: ${jamaatOutput.total_candidates} candidates (${jamaatOutput.real_candidates} real + ${jamaatOutput.mock_candidates} mock)`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'ncp_candidates.json'),
    JSON.stringify(ncpOutput, null, 2)
  );
  console.log(`NCP: ${ncpOutput.total_candidates} candidates (all mock)`);

  console.log(`\nFiles saved to ${OUTPUT_DIR}/`);
}

main();
