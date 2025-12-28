const fs = require('fs');
const path = require('path');

/**
 * Update BNP candidate data with JUIB seat allocation
 * BNP allocated 4 constituencies to Jamiat Ulama-e-Islam Bangladesh (JUIB)
 * Source: BNP press release, December 2025
 */

// JUIB allocation data
const JUIB_ALLOCATION = [
  {
    constituency_id: 233,
    constituency_english: "Sylhet-5",
    candidate_name: "মাওলানা মোহাম্মদ উবায়দুল্লাহ ফারুক",
    candidate_name_english: "Maulana Mohammad Ubaydullah Faruk",
    party_position: "President"
  },
  {
    constituency_id: 244,
    constituency_english: "Brahmanbaria-2",
    candidate_name: "মাওলানা জুনায়েদ আল হাবিব",
    candidate_name_english: "Maulana Zunaid Al Habib",
    party_position: "Vice President"
  },
  {
    constituency_id: 12,
    constituency_english: "Nilphamari-1",
    candidate_name: "মাওলানা মনজুরুল ইসলাম আফেন্দী",
    candidate_name_english: "Maulana Monzurul Islam Afendi",
    party_position: "Secretary General"
  },
  {
    constituency_id: 207,
    constituency_english: "Narayanganj-4",
    candidate_name: "মুফতি মনির হোসেন কাসেমী",
    candidate_name_english: "Mufti Monir Hossain Kasemi",
    party_position: "Central Leader"
  }
];

const BNP_CANDIDATES_PATH = path.join(__dirname, '../app/public/data/bnp_candidates.json');
const JUIB_CANDIDATES_PATH = path.join(__dirname, '../app/public/data/juib_candidates.json');

function updateBNPCandidates() {
  console.log('🗳️  Updating BNP candidate data with JUIB seat allocation...\n');

  // Read BNP candidates
  const bnpData = JSON.parse(fs.readFileSync(BNP_CANDIDATES_PATH, 'utf8'));

  const juibConstituencyIds = JUIB_ALLOCATION.map(a => a.constituency_id);
  const juibCandidates = [];

  // Process each BNP candidate entry
  bnpData.candidates.forEach(candidate => {
    if (juibConstituencyIds.includes(candidate.constituency_id)) {
      // Mark as allocated to JUIB
      candidate.allocated_to = "JUIB";
      candidate.allocated_to_full = "Jamiat Ulama-e-Islam Bangladesh";
      candidate.candidate_name = null;
      candidate.candidate_name_english = null;

      // Find the JUIB candidate info
      const juibInfo = JUIB_ALLOCATION.find(a => a.constituency_id === candidate.constituency_id);

      // Create JUIB candidate entry (copy constituency info from BNP)
      juibCandidates.push({
        candidate_id: candidate.candidate_id,
        serial: candidate.serial,
        constituency_id: candidate.constituency_id,
        constituency: candidate.constituency,
        constituency_english: candidate.constituency_english,
        division_id: candidate.division_id,
        division: candidate.division,
        division_english: candidate.division_english,
        district_id: candidate.district_id,
        district: candidate.district,
        district_english: candidate.district_english,
        areas: candidate.areas,
        candidate_name: juibInfo.candidate_name,
        candidate_name_english: juibInfo.candidate_name_english,
        party_position: juibInfo.party_position,
        alliance: "BNP-led 20-party alliance",
        allocation_source: "BNP"
      });

      console.log(`✓ ${candidate.constituency_english}: Allocated to JUIB - ${juibInfo.candidate_name_english}`);
    }
  });

  // Add note to BNP data metadata
  if (!bnpData.notes) {
    bnpData.notes = [];
  }
  bnpData.notes.push({
    date: "2025-12-27",
    note: "4 constituencies allocated to alliance partner Jamiat Ulama-e-Islam Bangladesh (JUIB): Sylhet-5, Brahmanbaria-2, Nilphamari-1, Narayanganj-4"
  });
  bnpData.allocated_constituencies = {
    JUIB: juibConstituencyIds
  };

  // Save updated BNP data
  fs.writeFileSync(BNP_CANDIDATES_PATH, JSON.stringify(bnpData, null, 2), 'utf8');
  console.log(`\n💾 Updated ${BNP_CANDIDATES_PATH}`);

  // Create JUIB candidates file
  const juibData = {
    party: "JUIB",
    party_full_name: "Jamiat Ulama-e-Islam Bangladesh",
    party_bengali: "জমিয়তে উলামায়ে ইসলাম বাংলাদেশ",
    party_symbol: "Date Palm Tree",
    party_symbol_bengali: "খেজুরগাছ",
    alliance: "BNP-led 20-party alliance",
    document_date: "2025-12-27",
    source: "BNP press release - 4 seat allocation to JUIB",
    total_seats: 4,
    candidates: juibCandidates
  };

  fs.writeFileSync(JUIB_CANDIDATES_PATH, JSON.stringify(juibData, null, 2), 'utf8');
  console.log(`💾 Created ${JUIB_CANDIDATES_PATH}`);

  console.log('\n✅ Done! JUIB allocation complete:');
  console.log(`   - ${juibCandidates.length} constituencies allocated to JUIB`);
  console.log(`   - BNP will not field candidates in these constituencies`);
  console.log(`   - JUIB candidates will use Date Palm Tree (খেজুরগাছ) symbol`);
}

// Run
try {
  updateBNPCandidates();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
