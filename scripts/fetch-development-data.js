/**
 * Fetch Development Score Data from Google Maps Places API
 *
 * Usage:
 *   GOOGLE_MAPS_API_KEY=your_key node scripts/fetch-development-data.js
 *
 * This script fetches nearby places for all 300 constituencies and
 * calculates development scores based on infrastructure density.
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const CONSTITUENCIES_PATH = path.join(__dirname, '../data/bd-constituencies.json');
const OUTPUT_PATH = path.join(__dirname, '../app/public/data/development-scores.json');

// Place types to search for each category
const CATEGORIES = {
  education: {
    types: ['school', 'university', 'library'],
    weight: 1.0,
    icon: 'school',
  },
  healthcare: {
    types: ['hospital', 'doctor', 'pharmacy', 'health'],
    weight: 1.2, // Healthcare weighted higher
    icon: 'hospital',
  },
  finance: {
    types: ['bank', 'atm'],
    weight: 0.8,
    icon: 'bank',
  },
  commerce: {
    types: ['shopping_mall', 'supermarket', 'market', 'store'],
    weight: 0.7,
    icon: 'store',
  },
  transport: {
    types: ['bus_station', 'train_station', 'transit_station'],
    weight: 0.9,
    icon: 'bus',
  },
};

// Search radius in meters (15km covers most constituencies)
const SEARCH_RADIUS = 15000;

// Rate limiting: Google allows 50 requests per second
const DELAY_MS = 100;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchNearbyPlaces(lat, lng, type) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${SEARCH_RADIUS}&type=${type}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.results.map(place => ({
        name: place.name,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating || null,
        types: place.types,
      }));
    }

    if (data.status === 'ZERO_RESULTS') {
      return [];
    }

    console.warn(`API warning for ${type}: ${data.status}`);
    return [];
  } catch (error) {
    console.error(`Error fetching ${type}:`, error.message);
    return [];
  }
}

async function fetchConstituencyData(constituency) {
  const { id, name_english, lat, long, registered_voters, district_english, division_english, areas } = constituency;

  console.log(`Fetching data for ${name_english} (${id}/300)...`);

  const categoryData = {};

  for (const [category, config] of Object.entries(CATEGORIES)) {
    const allPlaces = [];

    for (const type of config.types) {
      await sleep(DELAY_MS);
      const places = await fetchNearbyPlaces(lat, long, type);
      allPlaces.push(...places);
    }

    // Deduplicate places by name
    const uniquePlaces = [];
    const seenNames = new Set();
    for (const place of allPlaces) {
      if (!seenNames.has(place.name)) {
        seenNames.add(place.name);
        uniquePlaces.push(place);
      }
    }

    categoryData[category] = {
      count: uniquePlaces.length,
      places: uniquePlaces.slice(0, 20), // Keep top 20 for file size
      icon: config.icon,
    };
  }

  // Calculate scores (normalized 0-100)
  // Base scores on places per 100,000 voters
  const voterBase = (registered_voters || 400000) / 100000;

  const scores = {};
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [category, config] of Object.entries(CATEGORIES)) {
    const count = categoryData[category].count;
    // Normalize: assume 50 places per 100k voters is ideal (score 100)
    const rawScore = Math.min(100, (count / voterBase / 50) * 100);
    scores[category] = Math.round(rawScore);
    totalWeightedScore += rawScore * config.weight;
    totalWeight += config.weight;
  }

  const overallScore = Math.round(totalWeightedScore / totalWeight);

  // Determine urban classification based on area types
  const hasCity = areas?.some(a =>
    a.type === 'city_corporation_ward' ||
    a.type === 'municipality'
  );

  return {
    constituency_id: id,
    name_english,
    district: district_english,
    division: division_english,
    lat,
    lng: long,
    registered_voters: registered_voters || null,
    urban_classification: hasCity ? 'urban' : 'rural',
    overall_score: overallScore,
    scores,
    categories: categoryData,
    fetched_at: new Date().toISOString(),
  };
}

async function main() {
  if (!API_KEY) {
    console.error('Error: GOOGLE_MAPS_API_KEY environment variable is required');
    console.log('\nUsage:');
    console.log('  GOOGLE_MAPS_API_KEY=your_key node scripts/fetch-development-data.js');
    console.log('\nTo get an API key:');
    console.log('  1. Go to https://console.cloud.google.com/');
    console.log('  2. Enable Places API');
    console.log('  3. Create an API key');
    process.exit(1);
  }

  // Load constituencies
  const constituenciesData = JSON.parse(fs.readFileSync(CONSTITUENCIES_PATH, 'utf8'));
  const constituencies = constituenciesData.constituencies;

  console.log(`Found ${constituencies.length} constituencies\n`);

  const results = [];

  for (const constituency of constituencies) {
    const data = await fetchConstituencyData(constituency);
    results.push(data);

    // Save progress every 10 constituencies
    if (results.length % 10 === 0) {
      console.log(`Progress: ${results.length}/${constituencies.length}\n`);
    }
  }

  // Calculate national averages for comparison
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
  console.log(`\nDone! Saved to ${OUTPUT_PATH}`);
  console.log(`National average score: ${nationalAvg.overall}/100`);
}

main().catch(console.error);
