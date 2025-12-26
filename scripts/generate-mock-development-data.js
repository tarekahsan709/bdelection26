/**
 * Generate Mock Development Score Data
 *
 * This creates realistic mock data for UI development.
 * Run the actual fetch-development-data.js script with an API key
 * to get real Google Maps data.
 *
 * Usage: node scripts/generate-mock-development-data.js
 */

const fs = require('fs');
const path = require('path');

const CONSTITUENCIES_PATH = path.join(__dirname, '../data/bd-constituencies.json');
const OUTPUT_PATH = path.join(__dirname, '../app/public/data/development-scores.json');

// Seed random for reproducibility
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate realistic scores based on urban/rural classification
function generateScores(constituency, seed) {
  const areas = constituency.areas || [];
  const isUrban = areas.some(a =>
    a.type === 'city_corporation_ward' ||
    a.type === 'municipality'
  );

  // Urban areas score higher
  const baseScore = isUrban ? 65 : 40;
  const variance = isUrban ? 25 : 35;

  // Dhaka and Chittagong divisions score higher
  const divisionBonus =
    constituency.division_english === 'Dhaka' ? 15 :
    constituency.division_english === 'Chittagong' ? 10 :
    constituency.division_english === 'Sylhet' ? 5 : 0;

  const randomize = (base, idx) => {
    const r = seededRandom(seed + idx);
    return Math.min(100, Math.max(10, Math.round(base + divisionBonus + (r - 0.5) * variance)));
  };

  return {
    education: randomize(baseScore + 5, 1),
    healthcare: randomize(baseScore - 5, 2),
    finance: randomize(baseScore, 3),
    commerce: randomize(baseScore + 3, 4),
    transport: randomize(baseScore - 8, 5),
  };
}

// Generate mock place counts
function generatePlaceCounts(scores) {
  return {
    education: { count: Math.round(scores.education * 0.8), icon: 'school' },
    healthcare: { count: Math.round(scores.healthcare * 0.4), icon: 'hospital' },
    finance: { count: Math.round(scores.finance * 0.3), icon: 'bank' },
    commerce: { count: Math.round(scores.commerce * 0.6), icon: 'store' },
    transport: { count: Math.round(scores.transport * 0.15), icon: 'bus' },
  };
}

function main() {
  // Load constituencies
  const constituenciesData = JSON.parse(fs.readFileSync(CONSTITUENCIES_PATH, 'utf8'));
  const constituencies = constituenciesData.constituencies;

  console.log(`Generating mock data for ${constituencies.length} constituencies...\n`);

  const results = [];

  for (const c of constituencies) {
    const seed = parseInt(c.id) * 1000;
    const scores = generateScores(c, seed);
    const categories = generatePlaceCounts(scores);

    // Calculate overall score (weighted average)
    const weights = { education: 1.0, healthcare: 1.2, finance: 0.8, commerce: 0.7, transport: 0.9 };
    let totalWeighted = 0;
    let totalWeight = 0;
    for (const [cat, score] of Object.entries(scores)) {
      totalWeighted += score * weights[cat];
      totalWeight += weights[cat];
    }
    const overallScore = Math.round(totalWeighted / totalWeight);

    const areas = c.areas || [];
    const isUrban = areas.some(a =>
      a.type === 'city_corporation_ward' ||
      a.type === 'municipality'
    );

    results.push({
      constituency_id: c.id,
      name_english: c.name_english,
      name: c.name,
      district: c.district_english,
      division: c.division_english,
      lat: c.lat,
      lng: c.long,
      registered_voters: c.registered_voters || null,
      urban_classification: isUrban ? 'urban' : 'rural',
      overall_score: overallScore,
      scores,
      categories,
    });
  }

  // Calculate national averages
  const nationalAvg = {
    overall: Math.round(results.reduce((sum, r) => sum + r.overall_score, 0) / results.length),
    education: Math.round(results.reduce((sum, r) => sum + r.scores.education, 0) / results.length),
    healthcare: Math.round(results.reduce((sum, r) => sum + r.scores.healthcare, 0) / results.length),
    finance: Math.round(results.reduce((sum, r) => sum + r.scores.finance, 0) / results.length),
    commerce: Math.round(results.reduce((sum, r) => sum + r.scores.commerce, 0) / results.length),
    transport: Math.round(results.reduce((sum, r) => sum + r.scores.transport, 0) / results.length),
  };

  // Group by division for division averages
  const divisionAvg = {};
  const divisionGroups = {};
  for (const r of results) {
    if (!divisionGroups[r.division]) {
      divisionGroups[r.division] = [];
    }
    divisionGroups[r.division].push(r);
  }

  for (const [division, group] of Object.entries(divisionGroups)) {
    divisionAvg[division] = {
      overall: Math.round(group.reduce((sum, r) => sum + r.overall_score, 0) / group.length),
      education: Math.round(group.reduce((sum, r) => sum + r.scores.education, 0) / group.length),
      healthcare: Math.round(group.reduce((sum, r) => sum + r.scores.healthcare, 0) / group.length),
      finance: Math.round(group.reduce((sum, r) => sum + r.scores.finance, 0) / group.length),
      commerce: Math.round(group.reduce((sum, r) => sum + r.scores.commerce, 0) / group.length),
      transport: Math.round(group.reduce((sum, r) => sum + r.scores.transport, 0) / group.length),
    };
  }

  const output = {
    generated_at: new Date().toISOString(),
    data_source: 'mock',
    description: 'Mock development scores for UI development. Replace with real Google Maps data.',
    total_constituencies: results.length,
    national_average: nationalAvg,
    division_averages: divisionAvg,
    constituencies: results,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Done! Saved to ${OUTPUT_PATH}`);
  console.log(`\nNational average score: ${nationalAvg.overall}/100`);
  console.log(`\nDivision averages:`);
  for (const [div, avg] of Object.entries(divisionAvg)) {
    console.log(`  ${div}: ${avg.overall}/100`);
  }
}

main();
