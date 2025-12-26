const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

// Input/Output paths
const GEOJSON_PATH = path.join(__dirname, '../data/geojson/bangladesh.geojson');
const OUTPUT_PATH = path.join(__dirname, '../app/public/data/district-boundaries.json');

function main() {
  console.log('🚀 Generating district boundaries...');

  // Load GeoJSON
  const geoData = JSON.parse(fs.readFileSync(GEOJSON_PATH, 'utf8'));
  console.log(`📍 Loaded ${geoData.features.length} features`);

  // Group features by district (NAME_2)
  const districtGroups = {};

  geoData.features.forEach((feature) => {
    const districtName = feature.properties.NAME_2;
    const divisionName = feature.properties.NAME_1;

    if (!districtGroups[districtName]) {
      districtGroups[districtName] = {
        division: divisionName,
        features: []
      };
    }
    districtGroups[districtName].features.push(feature);
  });

  console.log(`📊 Found ${Object.keys(districtGroups).length} districts`);

  // Merge polygons for each district
  const districtFeatures = [];

  Object.entries(districtGroups).forEach(([districtName, data]) => {
    try {
      // Collect all polygons for this district
      const polygons = data.features.map(f => f.geometry);

      // Create a feature collection and union all polygons
      let merged;
      if (data.features.length === 1) {
        merged = data.features[0].geometry;
      } else {
        // Use union to merge all polygons
        let unionResult = data.features[0];
        for (let i = 1; i < data.features.length; i++) {
          try {
            unionResult = turf.union(
              turf.featureCollection([unionResult, data.features[i]])
            );
          } catch (e) {
            // If union fails, just use the current result
            console.log(`  ⚠️ Union failed for ${districtName}, using partial merge`);
          }
        }
        merged = unionResult.geometry;
      }

      districtFeatures.push({
        type: 'Feature',
        properties: {
          name: districtName,
          division: data.division,
          name_lower: districtName.toLowerCase()
        },
        geometry: merged
      });

    } catch (error) {
      console.log(`  ❌ Failed to merge ${districtName}: ${error.message}`);
    }
  });

  console.log(`✅ Generated ${districtFeatures.length} district boundaries`);

  // Create output GeoJSON
  const output = {
    type: 'FeatureCollection',
    features: districtFeatures
  };

  // Save output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output));
  console.log(`📁 Saved to: ${OUTPUT_PATH}`);

  // Log file size
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`📦 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
