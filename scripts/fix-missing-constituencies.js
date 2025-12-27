const fs = require('fs');

/**
 * Fix missing constituency coordinates by calculating from siblings
 * Run from project root: node scripts/fix-missing-constituencies.js
 */

// Load source and population data
const sourceData = JSON.parse(fs.readFileSync('./data/bd-constituencies.json', 'utf8'));
const popDataPath = './app/public/data/constituency-population.json';
const popData = JSON.parse(fs.readFileSync(popDataPath, 'utf8'));

// Known district center coordinates (approximate)
const districtCenters = {
  'Gaibandha': { lat: 25.3297, long: 89.5283 },
  'Naogaon': { lat: 24.7936, long: 88.9318 },
  'Rajshahi': { lat: 24.3745, long: 88.6042 },
  'Sirajgonj': { lat: 24.4534, long: 89.7006 },
  'Netrokona': { lat: 24.8705, long: 90.7286 },
  'Kishoreganj': { lat: 24.4449, long: 90.7766 },
  'Munshiganj': { lat: 23.5422, long: 90.5305 },
  'Dhaka': { lat: 23.8103, long: 90.4125 },
  'Gazipur': { lat: 24.0023, long: 90.4264 },
  'Narayanganj': { lat: 23.6238, long: 90.5000 },
  'Narsingdi': { lat: 23.9322, long: 90.7151 },
  'Lakshmipur': { lat: 22.9425, long: 90.8411 }
};

function getCoordinates(constituency) {
  const sourceC = sourceData.constituencies.find(x => x.id === constituency.id);
  if (!sourceC) return null;

  // Find siblings in same district with valid coordinates
  const siblings = sourceData.constituencies.filter(x =>
    x.district_id === sourceC.district_id && x.lat && x.long && x.lat !== 0 && x.long !== 0
  );

  // Extract constituency number (e.g., "Dhaka-13" -> 13)
  const match = constituency.name_english.match(/-(\d+)$/);
  const num = match ? parseInt(match[1]) : 1;

  if (siblings.length > 0) {
    // Calculate average of siblings
    const avgLat = siblings.reduce((s, x) => s + x.lat, 0) / siblings.length;
    const avgLong = siblings.reduce((s, x) => s + x.long, 0) / siblings.length;

    // Add offset based on constituency number to spread them
    const offset = 0.04;
    const angle = (num * 0.7) % (2 * Math.PI);

    return {
      lat: parseFloat((avgLat + Math.sin(angle) * offset).toFixed(6)),
      long: parseFloat((avgLong + Math.cos(angle) * offset).toFixed(6))
    };
  }

  // Fall back to district center
  const districtName = sourceC.district_english;
  if (districtCenters[districtName]) {
    const base = districtCenters[districtName];
    const offset = 0.03;
    const angle = (num * 0.7) % (2 * Math.PI);

    return {
      lat: parseFloat((base.lat + Math.sin(angle) * offset).toFixed(6)),
      long: parseFloat((base.long + Math.cos(angle) * offset).toFixed(6))
    };
  }

  return null;
}

// Find and fix missing coordinates
console.log('Fixing missing constituency coordinates...\n');
let updated = 0;

popData.constituencies.forEach(c => {
  if (!c.lat || !c.long || c.lat === 0 || c.long === 0) {
    const coords = getCoordinates(c);
    if (coords) {
      console.log(`✓ ${c.name_english}: (0, 0) -> (${coords.lat}, ${coords.long})`);
      c.lat = coords.lat;
      c.long = coords.long;
      updated++;
    } else {
      console.log(`✗ ${c.name_english}: Could not calculate coordinates`);
    }
  }
});

console.log(`\nUpdated ${updated} constituencies`);

// Also update the source file
sourceData.constituencies.forEach(c => {
  if (!c.lat || !c.long) {
    const popC = popData.constituencies.find(p => p.id === c.id);
    if (popC && popC.lat && popC.long) {
      c.lat = popC.lat;
      c.long = popC.long;
    }
  }
});

// Save files
fs.writeFileSync(popDataPath, JSON.stringify(popData, null, 2));
console.log(`Saved ${popDataPath}`);

fs.writeFileSync('./data/bd-constituencies.json', JSON.stringify(sourceData, null, 2));
console.log('Saved ./data/bd-constituencies.json');
