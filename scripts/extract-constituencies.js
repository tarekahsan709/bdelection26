const fs = require('fs');

// Read BNP candidates data (has all 300 constituencies)
const bnpData = JSON.parse(fs.readFileSync('./bnp_candidates.json', 'utf8'));

// Extract unique constituencies
const constituenciesMap = new Map();

bnpData.candidates.forEach(candidate => {
  const id = candidate.constituency_id;
  if (!constituenciesMap.has(id)) {
    constituenciesMap.set(id, {
      id: String(id),
      name: candidate.constituency,
      name_english: candidate.constituency_english,
      division_id: candidate.division_id,
      division: candidate.division,
      division_english: candidate.division_english,
      district_id: candidate.district_id,
      district: candidate.district,
      district_english: candidate.district_english,
      areas: candidate.areas.map(area => ({
        type: area.type,
        name: area.name,
        name_english: area.name_english,
        ...(area.upazila_id && { upazila_id: area.upazila_id })
      }))
    });
  }
});

// Sort by constituency ID
const constituencies = Array.from(constituenciesMap.values())
  .sort((a, b) => parseInt(a.id) - parseInt(b.id));

// Create output structure
const output = {
  total_constituencies: constituencies.length,
  description: "Bangladesh Parliamentary Constituencies (300 seats)",
  description_bengali: "বাংলাদেশ সংসদীয় নির্বাচনী এলাকা (৩০০ আসন)",
  constituencies: constituencies
};

// Write to file
fs.writeFileSync('./map-geojson/bd-constituencies.json', JSON.stringify(output, null, 2), 'utf8');

console.log(`Created bd-constituencies.json with ${constituencies.length} constituencies`);

// Print summary by division
const divisionCounts = {};
constituencies.forEach(c => {
  const div = c.division_english;
  divisionCounts[div] = (divisionCounts[div] || 0) + 1;
});
console.log('\nConstituencies by Division:');
Object.entries(divisionCounts).sort((a, b) => b[1] - a[1]).forEach(([div, count]) => {
  console.log(`  ${div}: ${count}`);
});
