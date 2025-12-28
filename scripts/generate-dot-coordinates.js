const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

// Input/Output paths
const GEOJSON_PATH = path.join(__dirname, '../data/geojson/bangladesh.geojson');
const POPULATION_DATA_PATH = path.join(__dirname, '../app/public/data/constituency-voters-2025.json');
const OUTPUT_VOTERS_PATH = path.join(__dirname, '../app/public/data/dot-density-voters.json');
const OUTPUT_POPULATION_PATH = path.join(__dirname, '../app/public/data/dot-density-population.json');

// Configuration - higher ratio for cleaner visualization with visible density variation
const DOT_RATIO = 5000; // Each dot represents 5,000 people (fewer dots = clearer density differences)

// District name mappings (constituency name -> GeoJSON name)
const DISTRICT_NAME_MAP = {
  'barishal': 'barisal',
  'chattogram': 'chittagong',
  'cumilla': 'comilla',
  'bogura': 'bogra',
  'jashore': 'jessore',
  'rangpur': 'ranpur',
  'tangail': 'tangali',
  // These districts might be part of larger districts in GeoJSON
  'gazipur': 'dhaka',
  'narayanganj': 'dhaka',
  'narsingdi': 'dhaka',
  'manikganj': 'dhaka',
  'munshiganj': 'dhaka',
  'brahmanbaria': 'comilla',
  'chandpur': 'comilla',
  'lakshmipur': 'noakhali',
  'feni': 'noakhali',
  'sirajgonj': 'pabna',
  'natore': 'rajshahi',
  'nawabganj': 'rajshahi',
  'naogaon': 'rajshahi',
  'joypurhat': 'bogra',
  'gaibandha': 'ranpur',
  'kurigram': 'ranpur',
  'lalmonirhat': 'ranpur',
  'nilphamari': 'dinajpur',
  'thakurgaon': 'dinajpur',
  'panchagarh': 'dinajpur',
  'netrokona': 'mymensingh',
  'sherpur': 'mymensingh',
  'sunamganj': 'sylhet',
  'habiganj': 'sylhet',
  'maulvibazar': 'sylhet',
  'bagerhat': 'khulna',
  'satkhira': 'khulna',
  'narail': 'jessore',
  'magura': 'jessore',
  'jhenaidah': 'jessore',
  'chuadanga': 'kushtia',
  'meherpur': 'kushtia',
  'rajbari': 'faridpur',
  'gopalganj': 'faridpur',
  'madaripur': 'faridpur',
  'shariatpur': 'faridpur',
  'bhola': 'barisal',
  'jhalokati': 'barisal',
  'pirojpur': 'barisal',
  'barguna': 'patuakhali',
  "cox's bazar": 'chittagong',
};

/**
 * Normalize district name for matching (with alias lookup)
 */
function normalizeDistrictName(name) {
  const normalized = name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Check if there's a mapping for this district
  return DISTRICT_NAME_MAP[normalized] || normalized;
}

/**
 * Build a map of district names to their polygon features
 */
function buildDistrictPolygonMap(geojson) {
  const districtMap = new Map();

  geojson.features.forEach((feature) => {
    const districtName = normalizeDistrictName(feature.properties.NAME_2);

    if (!districtMap.has(districtName)) {
      districtMap.set(districtName, []);
    }
    districtMap.get(districtName).push(feature);
  });

  console.log(`📍 Loaded ${districtMap.size} unique districts from GeoJSON`);
  return districtMap;
}

/**
 * Merge multiple polygon features into one for a district
 */
function mergeDistrictPolygons(features) {
  if (features.length === 1) {
    return features[0];
  }

  try {
    // Create a feature collection and union all polygons
    let merged = features[0];

    for (let i = 1; i < features.length; i++) {
      try {
        merged = turf.union(turf.featureCollection([merged, features[i]]));
      } catch (e) {
        // If union fails, continue
        continue;
      }
    }

    return merged;
  } catch (e) {
    // Fallback: return first feature
    return features[0];
  }
}

/**
 * Generate random points within a polygon using Turf.js
 */
function generatePointsInPolygon(polygon, numPoints) {
  const dots = [];

  if (numPoints <= 0) return dots;

  try {
    // Get bounding box for the polygon
    const bbox = turf.bbox(polygon);

    // Generate more points than needed, then filter to those inside polygon
    let attempts = 0;
    const maxAttempts = numPoints * 20;

    while (dots.length < numPoints && attempts < maxAttempts) {
      // Generate batch of random points within bounding box
      const batchSize = Math.min(200, (numPoints - dots.length) * 3);
      const randomPoints = turf.randomPoint(batchSize, { bbox });

      randomPoints.features.forEach((point) => {
        if (dots.length >= numPoints) return;

        try {
          // Check if point is inside polygon
          if (turf.booleanPointInPolygon(point, polygon)) {
            const [lng, lat] = point.geometry.coordinates;
            dots.push({
              lat: parseFloat(lat.toFixed(5)),
              lng: parseFloat(lng.toFixed(5)),
            });
          }
        } catch (e) {
          // Skip invalid points
        }
      });

      attempts += batchSize;
    }
  } catch (e) {
    console.warn(`    Warning: Error generating points: ${e.message}`);
  }

  return dots;
}

/**
 * Fallback: Generate dots using circular distribution (for unmatched districts)
 */
function generateDotsCircular(centerLat, centerLng, numDots) {
  const dots = [];
  const radiusKm = 25; // Larger radius for better spread
  const radiusLat = radiusKm / 111;
  const radiusLng = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));

  for (let i = 0; i < numDots; i++) {
    // Use polar coordinates for uniform circular distribution
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * radiusLat;

    const lat = centerLat + distance * Math.cos(angle);
    const lng = centerLng + (distance / radiusLat) * radiusLng * Math.sin(angle);

    dots.push({
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5)),
    });
  }

  return dots;
}

/**
 * Generate dots for all constituencies using polygon boundaries
 */
function generateDotsWithPolygons(constituencies, districtPolygonMap, dataType) {
  console.log(`\n🔵 Generating ${dataType} dot density data...`);

  const allDots = [];
  let totalCount = 0;
  let matchedDistricts = 0;
  let unmatchedDistricts = 0;

  constituencies.forEach((constituency, index) => {
    const count =
      dataType === 'voters'
        ? constituency.registered_voters
        : constituency.total_population;

    totalCount += count;
    const numDots = Math.floor(count / DOT_RATIO);

    if (numDots === 0) return;

    // Try to find matching district polygon
    const districtName = normalizeDistrictName(constituency.district_english);
    const polygonFeatures = districtPolygonMap.get(districtName);

    let dots = [];

    if (polygonFeatures && polygonFeatures.length > 0) {
      // Use polygon-based generation
      const mergedPolygon = mergeDistrictPolygons(polygonFeatures);
      dots = generatePointsInPolygon(mergedPolygon, numDots);

      if (dots.length > 0) {
        matchedDistricts++;
      }
    }

    // Fallback to circular if polygon generation didn't work well
    if (dots.length < numDots * 0.5 && constituency.lat && constituency.long) {
      const remaining = numDots - dots.length;
      const circularDots = generateDotsCircular(
        constituency.lat,
        constituency.long,
        remaining
      );
      dots = [...dots, ...circularDots];

      if (!polygonFeatures || polygonFeatures.length === 0) {
        unmatchedDistricts++;
      }
    }

    // Add constituency and division info to each dot for multi-color rendering
    dots.forEach((dot) => {
      dot.c_id = constituency.id;
      dot.d_id = constituency.division_id; // Division ID for color coding
      dot.u = constituency.urban_classification === 'urban';
    });

    allDots.push(...dots);

    if ((index + 1) % 50 === 0) {
      console.log(`   Processed ${index + 1}/${constituencies.length} constituencies...`);
    }
  });

  console.log(`   ✅ Generated ${allDots.length.toLocaleString()} dots from ${totalCount.toLocaleString()} ${dataType}`);
  console.log(`   📊 Polygon-matched: ${matchedDistricts}, Fallback circular: ${unmatchedDistricts}`);

  return {
    data_type: dataType,
    dot_ratio: DOT_RATIO,
    total_dots: allDots.length,
    total_count: totalCount,
    generated_at: new Date().toISOString(),
    dots: allDots,
  };
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting dot coordinate generation with polygon boundaries...\n');

  // Load GeoJSON
  if (!fs.existsSync(GEOJSON_PATH)) {
    console.error(`❌ Error: GeoJSON not found at ${GEOJSON_PATH}`);
    process.exit(1);
  }

  const geojson = JSON.parse(fs.readFileSync(GEOJSON_PATH, 'utf8'));
  console.log(`📍 Loaded GeoJSON with ${geojson.features.length} features`);

  // Build district polygon map
  const districtPolygonMap = buildDistrictPolygonMap(geojson);

  // Load constituency population data
  if (!fs.existsSync(POPULATION_DATA_PATH)) {
    console.error(`❌ Error: constituency-voters-2025.json not found`);
    console.error('   Please run generate-constituency-population.js first.');
    process.exit(1);
  }

  const populationData = JSON.parse(fs.readFileSync(POPULATION_DATA_PATH, 'utf8'));
  const constituencies = populationData.constituencies;
  console.log(`📊 Total constituencies: ${constituencies.length}`);

  // Generate voter dots
  const voterDotData = generateDotsWithPolygons(
    constituencies,
    districtPolygonMap,
    'voters'
  );
  fs.writeFileSync(OUTPUT_VOTERS_PATH, JSON.stringify(voterDotData));
  console.log(`   📁 Saved to: ${OUTPUT_VOTERS_PATH}`);

  // Generate population dots
  const populationDotData = generateDotsWithPolygons(
    constituencies,
    districtPolygonMap,
    'population'
  );
  fs.writeFileSync(OUTPUT_POPULATION_PATH, JSON.stringify(populationDotData));
  console.log(`   📁 Saved to: ${OUTPUT_POPULATION_PATH}`);

  // Summary
  console.log('\n✅ Dot coordinate generation complete!\n');
  console.log('📈 Summary:');
  console.log(`   Voter Dots: ${voterDotData.total_dots.toLocaleString()}`);
  console.log(`   Population Dots: ${populationDotData.total_dots.toLocaleString()}`);
  console.log(`   Dot Ratio: 1 dot = ${DOT_RATIO.toLocaleString()} people`);

  // File size info
  const votersSize = (fs.statSync(OUTPUT_VOTERS_PATH).size / 1024 / 1024).toFixed(2);
  const populationSize = (fs.statSync(OUTPUT_POPULATION_PATH).size / 1024 / 1024).toFixed(2);
  console.log(`\n📦 File Sizes:`);
  console.log(`   Voters: ${votersSize} MB`);
  console.log(`   Population: ${populationSize} MB`);
}

// Run
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
