/**
 * Fetch infrastructure data from OpenStreetMap for all constituencies
 * Uses Overpass API (free, no API key required)
 */

const fs = require('fs');
const path = require('path');

// Paths
const POPULATION_DATA = path.join(__dirname, '../app/public/data/constituency-population.json');
const OUTPUT_PATH = path.join(__dirname, '../app/public/data/constituency-infrastructure.json');

// Overpass API endpoints (multiple for load balancing)
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
let currentUrlIndex = 0;

// Infrastructure categories to query (simplified for speed)
const CATEGORIES = [
  { key: 'schools', tag: 'amenity', value: 'school', label: 'বিদ্যালয়', labelEn: 'Schools' },
  { key: 'hospitals', tag: 'amenity', value: 'hospital', label: 'হাসপাতাল', labelEn: 'Hospitals' },
  { key: 'clinics', tag: 'amenity', value: 'clinic', label: 'ক্লিনিক', labelEn: 'Clinics' },
  { key: 'banks', tag: 'amenity', value: 'bank', label: 'ব্যাংক', labelEn: 'Banks' },
  { key: 'markets', tag: 'amenity', value: 'marketplace', label: 'বাজার', labelEn: 'Markets' },
  { key: 'mosques', tag: 'amenity', value: 'place_of_worship', label: 'উপাসনালয়', labelEn: 'Places of Worship' },
];

// Delay between requests to be respectful to the API
const DELAY_MS = 2000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get next Overpass URL (rotate for load balancing)
 */
function getOverpassUrl() {
  const url = OVERPASS_URLS[currentUrlIndex];
  currentUrlIndex = (currentUrlIndex + 1) % OVERPASS_URLS.length;
  return url;
}

/**
 * Query Overpass API for a specific category at a location
 */
async function queryOverpass(lat, lng, radiusKm, category, retries = 2) {
  const radiusMeters = radiusKm * 1000;

  // Simpler query - just nodes for speed
  const query = `
    [out:json][timeout:25];
    node["${category.tag}"="${category.value}"](around:${radiusMeters},${lat},${lng});
    out count;
  `;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = getOverpassUrl();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (response.status === 429 || response.status === 504) {
        // Rate limited or timeout - wait and retry
        console.log(`    Rate limited, waiting...`);
        await sleep(5000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();
      if (text.startsWith('<?xml') || text.includes('<error>')) {
        throw new Error('API returned error');
      }

      const data = JSON.parse(text);
      const total = data.elements?.[0]?.tags?.total;
      return total ? parseInt(total, 10) : 0;
    } catch (error) {
      if (attempt === retries) {
        console.error(`    ${category.key}: ${error.message}`);
        return -1; // Return -1 to indicate error
      }
      await sleep(3000);
    }
  }

  return -1;
}

/**
 * Fetch all infrastructure data for a single constituency
 */
async function fetchConstituencyInfrastructure(constituency, index, total) {
  const { id, name_english, lat, long } = constituency;

  // Estimate search radius based on urban/rural (urban areas are denser)
  const radiusKm = constituency.urban_classification === 'urban' ? 10 : 15;

  console.log(`[${index + 1}/${total}] ${name_english} (${lat?.toFixed(3)}, ${long?.toFixed(3)})`);

  if (!lat || !long) {
    console.log('  ⚠ No coordinates, skipping');
    return null;
  }

  const infrastructure = {};
  let successCount = 0;

  for (const category of CATEGORIES) {
    const count = await queryOverpass(lat, long, radiusKm, category);
    infrastructure[category.key] = count;
    if (count >= 0) {
      console.log(`  ${category.labelEn}: ${count}`);
      successCount++;
    }
    await sleep(800); // Small delay between category queries
  }

  return {
    constituency_id: id,
    name_english,
    lat,
    long,
    radius_km: radiusKm,
    ...infrastructure,
    fetched_at: new Date().toISOString(),
    success_rate: `${successCount}/${CATEGORIES.length}`,
  };
}

/**
 * Main function
 */
async function main() {
  console.log('🗺️  Fetching infrastructure data from OpenStreetMap...\n');

  // Load constituency data
  const populationData = JSON.parse(fs.readFileSync(POPULATION_DATA, 'utf-8'));
  const constituencies = populationData.constituencies;

  console.log(`Found ${constituencies.length} constituencies\n`);

  // Check if we have partial data to resume from
  let existingData = { constituencies: [] };
  let startIndex = 0;

  if (fs.existsSync(OUTPUT_PATH)) {
    existingData = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    startIndex = existingData.constituencies.length;
    console.log(`Resuming from constituency ${startIndex + 1}...\n`);
  }

  const results = [...existingData.constituencies];

  // Process each constituency
  for (let i = startIndex; i < constituencies.length; i++) {
    const constituency = constituencies[i];

    try {
      const infraData = await fetchConstituencyInfrastructure(constituency, i, constituencies.length);

      if (infraData) {
        results.push(infraData);
      }

      // Save progress after each constituency
      const output = {
        generated_at: new Date().toISOString(),
        source: 'OpenStreetMap Overpass API',
        categories: CATEGORIES.map(c => ({ key: c.key, label: c.label, labelEn: c.labelEn })),
        total_constituencies: constituencies.length,
        completed: results.length,
        constituencies: results,
      };

      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
      console.log(`  ✓ Saved (${results.length}/${constituencies.length})\n`);

      // Delay between constituencies to respect rate limits
      if (i < constituencies.length - 1) {
        await sleep(DELAY_MS);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${constituency.name_english}: ${error.message}`);
      // Continue to next constituency
    }
  }

  console.log(`\n✅ Done! Fetched infrastructure data for ${results.length} constituencies`);
  console.log(`📁 Output: ${OUTPUT_PATH}`);
}

// Run
main().catch(console.error);
