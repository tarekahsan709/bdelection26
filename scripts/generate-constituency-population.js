const fs = require('fs');
const path = require('path');

// Input/Output paths
const CONSTITUENCIES_PATH = path.join(__dirname, '../data/bd-constituencies.json');
const DIVISIONS_PATH = path.join(__dirname, '../data/geojson/bd-divisions.json');
const DISTRICTS_PATH = path.join(__dirname, '../data/geojson/bd-districts.json');
const OUTPUT_PATH = path.join(__dirname, '../app/public/data/constituency-population.json');

// Voter to population ratio (Bangladesh avg: ~110M voters / ~170M population = 1:1.54)
const VOTER_TO_POPULATION_RATIO = 1.54;

/**
 * Classifies a constituency as urban or rural based on its areas
 * Urban: Has any city_corporation_ward or municipality areas
 * Rural: All others
 */
function classifyConstituency(constituency) {
  const hasUrbanAreas = constituency.areas.some(area =>
    area.type === 'city_corporation_ward' || area.type === 'municipality'
  );

  return hasUrbanAreas ? 'urban' : 'rural';
}

/**
 * Generates constituency population data
 */
function generateConstituencyPopulation() {
  console.log('🚀 Starting constituency population data generation...\n');

  // Read constituencies data
  const constituenciesData = JSON.parse(fs.readFileSync(CONSTITUENCIES_PATH, 'utf8'));
  const constituencies = constituenciesData.constituencies;

  // Read divisions and districts for Bangla names
  const divisionsData = JSON.parse(fs.readFileSync(DIVISIONS_PATH, 'utf8'));
  const districtsData = JSON.parse(fs.readFileSync(DISTRICTS_PATH, 'utf8'));

  // Create lookup maps for Bangla names
  const divisionBnNames = new Map();
  divisionsData.divisions.forEach(d => divisionBnNames.set(d.id, d.bn_name));

  const districtBnNames = new Map();
  districtsData.districts.forEach(d => districtBnNames.set(d.id, d.bn_name));

  console.log(`📊 Total constituencies: ${constituencies.length}`);

  // Process each constituency
  const results = constituencies.map((constituency, index) => {
    const registeredVoters = constituency.registered_voters || 0;
    const estimatedPopulation = Math.round(registeredVoters * VOTER_TO_POPULATION_RATIO);
    const urbanClassification = classifyConstituency(constituency);

    if (!constituency.lat || !constituency.long) {
      console.warn(`⚠️  ${constituency.name_english}: Missing lat/long coordinates`);
    }

    if (!constituency.registered_voters) {
      console.warn(`⚠️  ${constituency.name_english}: Missing voter data`);
    }

    return {
      id: constituency.id,
      name_english: constituency.name_english,
      name: constituency.name,
      total_population: estimatedPopulation,
      registered_voters: registeredVoters,
      urban_classification: urbanClassification,
      lat: constituency.lat || 0,
      long: constituency.long || 0,
      division_id: constituency.division_id,
      division: divisionBnNames.get(constituency.division_id) || constituency.division_english,
      division_english: constituency.division_english,
      district_id: constituency.district_id,
      district: districtBnNames.get(constituency.district_id) || constituency.district_english,
      district_english: constituency.district_english,
    };
  });

  // Calculate statistics
  const stats = {
    total_constituencies: results.length,
    total_population: results.reduce((sum, c) => sum + c.total_population, 0),
    total_voters: results.reduce((sum, c) => sum + c.registered_voters, 0),
    urban_constituencies: results.filter(c => c.urban_classification === 'urban').length,
    rural_constituencies: results.filter(c => c.urban_classification === 'rural').length,
    urban_population: results.filter(c => c.urban_classification === 'urban')
      .reduce((sum, c) => sum + c.total_population, 0),
    rural_population: results.filter(c => c.urban_classification === 'rural')
      .reduce((sum, c) => sum + c.total_population, 0),
    missing_coordinates: results.filter(c => !c.lat || !c.long).length,
    missing_voters: results.filter(c => !c.registered_voters).length,
  };

  // Create output object
  const output = {
    metadata: {
      source: 'Generated from bd-constituencies.json voter data',
      estimation_method: 'Voter-to-population ratio (1:1.54)',
      generated_at: new Date().toISOString(),
      note: 'Population estimates based on registered voters. Update with BBS census data for accuracy.',
    },
    statistics: stats,
    constituencies: results,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output file
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  // Print statistics
  console.log('\n✅ Constituency population data generated successfully!\n');
  console.log('📈 Statistics:');
  console.log(`   Total Constituencies: ${stats.total_constituencies}`);
  console.log(`   Total Population (estimated): ${stats.total_population.toLocaleString()}`);
  console.log(`   Total Registered Voters: ${stats.total_voters.toLocaleString()}`);
  console.log(`   Urban Constituencies: ${stats.urban_constituencies} (${((stats.urban_constituencies/stats.total_constituencies)*100).toFixed(1)}%)`);
  console.log(`   Rural Constituencies: ${stats.rural_constituencies} (${((stats.rural_constituencies/stats.total_constituencies)*100).toFixed(1)}%)`);
  console.log(`   Urban Population: ${stats.urban_population.toLocaleString()} (${((stats.urban_population/stats.total_population)*100).toFixed(1)}%)`);
  console.log(`   Rural Population: ${stats.rural_population.toLocaleString()} (${((stats.rural_population/stats.total_population)*100).toFixed(1)}%)`);
  console.log(`   \n⚠️  Missing Coordinates: ${stats.missing_coordinates}`);
  console.log(`   ⚠️  Missing Voter Data: ${stats.missing_voters}`);
  console.log(`\n📁 Output written to: ${OUTPUT_PATH}`);
}

// Run the script
try {
  generateConstituencyPopulation();
} catch (error) {
  console.error('❌ Error generating constituency population data:', error.message);
  process.exit(1);
}
