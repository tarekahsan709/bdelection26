#!/usr/bin/env node
/**
 * Generate constituency boundary polygons by merging upazila polygons
 *
 * This script:
 * 1. Reads upazila polygons from bangladesh.geojson
 * 2. Reads constituency → upazila mapping from bd-constituencies.json
 * 3. Merges upazila polygons for each constituency
 * 4. Outputs constituencies.geojson
 */

const fs = require('fs');
const path = require('path');
// Load turf from app/node_modules since that's where npm installs it
const turf = require(path.join(__dirname, '..', 'app', 'node_modules', '@turf', 'turf'));

// Paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const GEOJSON_DIR = path.join(DATA_DIR, 'geojson');
const OUTPUT_PATH = path.join(__dirname, '..', 'app', 'public', 'data', 'constituencies.geojson');

// Load data
console.log('📂 Loading data files...');
const geoData = JSON.parse(fs.readFileSync(path.join(GEOJSON_DIR, 'bangladesh.geojson'), 'utf8'));
const upazilaData = JSON.parse(fs.readFileSync(path.join(GEOJSON_DIR, 'bd-upazilas.json'), 'utf8'));
const constituencyData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bd-constituencies.json'), 'utf8'));

console.log(`  Loaded ${geoData.features.length} upazila polygons`);
console.log(`  Loaded ${upazilaData.upazilas.length} upazila records`);
console.log(`  Loaded ${constituencyData.constituencies.length} constituencies`);

// Create upazila ID to name mapping
const upazilaIdToName = new Map();
upazilaData.upazilas.forEach(u => {
  upazilaIdToName.set(u.id, u.name);
});

// Normalize name for matching
function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+upazila$/i, '')
    .replace(/\s+upazilla$/i, '')
    .replace(/\s+sadar$/i, ' sadar')
    .replace(/\bsadar\b/i, 'sadar')
    .replace(/\bs\.$/i, 'sadar')
    .replace(/-s$/i, ' sadar')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build GeoJSON feature lookup by normalized name
const geoFeaturesByName = new Map();
const geoFeaturesByDistrict = new Map();

geoData.features.forEach(feature => {
  const props = feature.properties;
  const name = props.NAME_4 || '';
  const district = props.NAME_2 || '';
  const normalized = normalizeName(name);

  // Store by normalized name
  if (!geoFeaturesByName.has(normalized)) {
    geoFeaturesByName.set(normalized, []);
  }
  geoFeaturesByName.get(normalized).push(feature);

  // Also store by district for fallback matching
  const key = `${normalizeName(district)}:${normalized}`;
  geoFeaturesByDistrict.set(key, feature);
});

// Find polygon for an upazila
function findPolygon(upazilaId, areaName, districtName, constituencyName) {
  let upazilaName = upazilaIdToName.get(upazilaId);

  // Fallback to area name if ID lookup fails
  if (!upazilaName && areaName) {
    upazilaName = areaName.replace(/\s+upazila$/i, '').replace(/\s+upazilla$/i, '');
  }

  if (!upazilaName) {
    console.warn(`    ⚠️ No upazila name for ID ${upazilaId}`);
    return null;
  }

  const normalized = normalizeName(upazilaName);

  // Try exact match first
  const matches = geoFeaturesByName.get(normalized);
  if (matches && matches.length === 1) {
    return matches[0];
  }

  // Try with district context
  if (districtName) {
    const key = `${normalizeName(districtName)}:${normalized}`;
    const match = geoFeaturesByDistrict.get(key);
    if (match) {
      return match;
    }
  }

  // Try fuzzy matching
  for (const [name, features] of geoFeaturesByName) {
    if (name.includes(normalized) || normalized.includes(name)) {
      if (features.length === 1) {
        return features[0];
      }
      // If multiple, try to match by district
      for (const f of features) {
        if (districtName && normalizeName(f.properties.NAME_2) === normalizeName(districtName)) {
          return f;
        }
      }
    }
  }

  console.warn(`    ⚠️ No polygon found for "${upazilaName}" (ID: ${upazilaId})`);
  return null;
}

// Merge polygons
function mergePolygons(polygons) {
  if (polygons.length === 0) return null;
  if (polygons.length === 1) return polygons[0];

  try {
    // Convert all to features
    const features = polygons.map(p => {
      if (p.type === 'Feature') return p;
      return turf.feature(p);
    });

    // Union all polygons
    let merged = features[0];
    for (let i = 1; i < features.length; i++) {
      try {
        merged = turf.union(turf.featureCollection([merged, features[i]]));
      } catch (e) {
        console.warn(`    ⚠️ Union failed for polygon ${i}, using buffer workaround`);
        // Try with tiny buffer to fix topology issues
        const buffered1 = turf.buffer(merged, 0.0001, { units: 'kilometers' });
        const buffered2 = turf.buffer(features[i], 0.0001, { units: 'kilometers' });
        merged = turf.union(turf.featureCollection([buffered1, buffered2]));
      }
    }

    return merged;
  } catch (e) {
    console.warn(`    ⚠️ Merge failed: ${e.message}`);
    // Fallback: return convex hull
    const allCoords = [];
    polygons.forEach(p => {
      const coords = turf.coordAll(p.type === 'Feature' ? p : turf.feature(p));
      allCoords.push(...coords);
    });
    return turf.convex(turf.featureCollection(allCoords.map(c => turf.point(c))));
  }
}

// Process constituencies
console.log('\n🔧 Processing constituencies...\n');

const constituencyFeatures = [];
let successCount = 0;
let partialCount = 0;
let failCount = 0;

for (const constituency of constituencyData.constituencies) {
  const areas = constituency.areas || [];
  const upazilaPolygons = [];
  let foundCount = 0;

  // Get type breakdown for logging
  const areaTypes = areas.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  // Only process upazilas (skip city_corporation_ward, municipality, etc.)
  const upazilaAreas = areas.filter(a => a.type === 'upazila');

  for (const area of upazilaAreas) {
    const polygon = findPolygon(area.upazila_id, area.name_english, constituency.district_english, constituency.name_english);
    if (polygon) {
      upazilaPolygons.push(polygon);
      foundCount++;
    }
  }

  // Log progress
  const typesStr = Object.entries(areaTypes).map(([k, v]) => `${k}:${v}`).join(', ');

  if (upazilaPolygons.length === 0) {
    console.log(`❌ [${constituency.id}] ${constituency.name_english} - No polygons found (${typesStr})`);
    failCount++;
    continue;
  }

  if (foundCount < upazilaAreas.length) {
    console.log(`⚠️ [${constituency.id}] ${constituency.name_english} - ${foundCount}/${upazilaAreas.length} upazilas (${typesStr})`);
    partialCount++;
  } else {
    console.log(`✓ [${constituency.id}] ${constituency.name_english} - ${foundCount} upazilas merged`);
    successCount++;
  }

  // Merge polygons
  const merged = mergePolygons(upazilaPolygons);
  if (merged) {
    merged.properties = {
      id: constituency.id,
      name: constituency.name,
      name_english: constituency.name_english,
      division_id: constituency.division_id,
      division: constituency.division,
      division_english: constituency.division_english,
      district_id: constituency.district_id,
      district: constituency.district,
      district_english: constituency.district_english,
      registered_voters: constituency.registered_voters,
      lat: constituency.lat,
      long: constituency.long,
    };
    constituencyFeatures.push(merged);
  }
}

// Create output GeoJSON
const output = {
  type: 'FeatureCollection',
  generated: new Date().toISOString(),
  total_constituencies: constituencyFeatures.length,
  features: constituencyFeatures,
};

// Write output
console.log('\n📝 Writing output...');
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output));

const fileSizeKB = (fs.statSync(OUTPUT_PATH).size / 1024).toFixed(1);
console.log(`\n✅ Done! Generated ${OUTPUT_PATH}`);
console.log(`   File size: ${fileSizeKB} KB`);
console.log(`\n📊 Summary:`);
console.log(`   ✓ Full match: ${successCount} constituencies`);
console.log(`   ⚠️ Partial match: ${partialCount} constituencies`);
console.log(`   ❌ No polygons: ${failCount} constituencies`);
console.log(`   Total generated: ${constituencyFeatures.length}/300 constituencies`);
