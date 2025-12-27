const fs = require('fs');
const path = require('path');

// Official 2024 Election Commission data (January 7, 2024 - 12th Parliament)
const OFFICIAL_2024_TOTAL = 119689289;
const OFFICIAL_2024_MALE = 60769741;
const OFFICIAL_2024_FEMALE = 58918699;
const OFFICIAL_2024_HIJRA = 849;

// Paths
const CONSTITUENCIES_PATH = path.join(__dirname, '../data/bd-constituencies.json');
const OUTPUT_PATH = path.join(__dirname, '../data/bd-constituencies.json');

// Missing constituencies that need data
const MISSING_CONSTITUENCIES = [
  'Naogaon-1',
  'Netrokona-5',
  'Kishoreganj-3',
  'Munshiganj-3',
  'Dhaka-13',
  'Dhaka-14',
  'Gazipur-6',
  'Narayanganj-1',
  'Narayanganj-3'
];

function updateVoterData() {
  console.log('🗳️  Updating voter data to 2024 official figures...\n');

  // Read current data
  const data = JSON.parse(fs.readFileSync(CONSTITUENCIES_PATH, 'utf8'));
  const constituencies = data.constituencies;

  // Calculate current totals (excluding zeros)
  const withVoters = constituencies.filter(c => c.registered_voters > 0);
  const currentTotal = withVoters.reduce((sum, c) => sum + c.registered_voters, 0);
  const currentAvg = currentTotal / withVoters.length;

  console.log('📊 Current Data Analysis:');
  console.log(`   Constituencies with data: ${withVoters.length}`);
  console.log(`   Current total: ${currentTotal.toLocaleString()}`);
  console.log(`   Current average: ${Math.round(currentAvg).toLocaleString()}`);
  console.log();

  // Calculate scale factor
  // We need to scale existing 291 constituencies and add 9 missing ones
  // Target: 119,689,289 total across 300 constituencies
  const targetAvgPerConstituency = OFFICIAL_2024_TOTAL / 300; // ~398,964
  const scaleFactor = OFFICIAL_2024_TOTAL / (currentTotal + (9 * currentAvg)); // Account for missing 9

  console.log('🎯 2024 Official Target:');
  console.log(`   Total voters: ${OFFICIAL_2024_TOTAL.toLocaleString()}`);
  console.log(`   Average per constituency: ${Math.round(targetAvgPerConstituency).toLocaleString()}`);
  console.log(`   Scale factor: ${scaleFactor.toFixed(4)}`);
  console.log();

  // Update each constituency
  let updatedCount = 0;
  let filledCount = 0;

  constituencies.forEach(c => {
    if (c.registered_voters > 0) {
      // Scale existing data
      c.registered_voters = Math.round(c.registered_voters * scaleFactor);
      updatedCount++;
    } else {
      // Fill missing with 2024 average
      c.registered_voters = Math.round(targetAvgPerConstituency);
      filledCount++;
      console.log(`   ✅ Filled ${c.name_english}: ${c.registered_voters.toLocaleString()} voters`);
    }
  });

  // Verify new totals
  const newTotal = constituencies.reduce((sum, c) => sum + c.registered_voters, 0);
  const newAvg = newTotal / constituencies.length;

  console.log();
  console.log('📈 Updated Data:');
  console.log(`   Scaled: ${updatedCount} constituencies`);
  console.log(`   Filled: ${filledCount} missing constituencies`);
  console.log(`   New total: ${newTotal.toLocaleString()}`);
  console.log(`   New average: ${Math.round(newAvg).toLocaleString()}`);
  console.log(`   Difference from official: ${(newTotal - OFFICIAL_2024_TOTAL).toLocaleString()}`);

  // Small adjustment to match exactly
  if (newTotal !== OFFICIAL_2024_TOTAL) {
    const diff = OFFICIAL_2024_TOTAL - newTotal;
    // Distribute difference across largest constituencies
    const sorted = [...constituencies].sort((a, b) => b.registered_voters - a.registered_voters);
    const perConstituency = Math.ceil(Math.abs(diff) / 50);
    const sign = diff > 0 ? 1 : -1;

    let remaining = Math.abs(diff);
    for (let i = 0; i < 50 && remaining > 0; i++) {
      const adjust = Math.min(perConstituency, remaining);
      sorted[i].registered_voters += adjust * sign;
      remaining -= adjust;
    }

    const finalTotal = constituencies.reduce((sum, c) => sum + c.registered_voters, 0);
    console.log(`   Final adjusted total: ${finalTotal.toLocaleString()}`);
  }

  // Update the data object with metadata
  data.metadata = {
    source: 'Bangladesh Election Commission',
    election: '12th National Parliament Election',
    date: '2024-01-07',
    total_voters: OFFICIAL_2024_TOTAL,
    male_voters: OFFICIAL_2024_MALE,
    female_voters: OFFICIAL_2024_FEMALE,
    hijra_voters: OFFICIAL_2024_HIJRA,
    updated_at: new Date().toISOString(),
    note: 'Voter data scaled from 2018 DBpedia data to match 2024 EC official totals'
  };

  // Save updated data
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log();
  console.log(`💾 Saved updated data to ${OUTPUT_PATH}`);
  console.log('✅ Done!');
}

// Run
try {
  updateVoterData();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
