/**
 * Test OSM Overpass API
 */

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

async function test() {
  const lat = 23.7644;
  const lng = 90.389;
  const radius = 8000;

  console.log('Testing OSM Overpass API for Dhaka-1 area...\n');
  console.log(`Location: ${lat}, ${lng}`);
  console.log(`Radius: ${radius}m\n`);

  const categories = [
    { key: 'schools', tag: 'amenity', value: 'school' },
    { key: 'hospitals', tag: 'amenity', value: 'hospital' },
    { key: 'clinics', tag: 'amenity', value: 'clinic' },
    { key: 'banks', tag: 'amenity', value: 'bank' },
    { key: 'markets', tag: 'amenity', value: 'marketplace' },
  ];

  for (const cat of categories) {
    const query = `
      [out:json][timeout:30];
      (
        node["${cat.tag}"="${cat.value}"](around:${radius},${lat},${lng});
        way["${cat.tag}"="${cat.value}"](around:${radius},${lat},${lng});
      );
      out count;
    `;

    try {
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        console.log(`${cat.key}: Error ${response.status}`);
        continue;
      }

      const text = await response.text();

      // Check if it's an error response
      if (text.startsWith('<?xml') || text.includes('error')) {
        console.log(`${cat.key}: API Error`);
        continue;
      }

      const data = JSON.parse(text);
      const count = data.elements?.[0]?.tags?.total || data.elements?.length || 0;
      console.log(`${cat.key}: ${count}`);
    } catch (err) {
      console.log(`${cat.key}: ${err.message}`);
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n✅ Test complete!');
}

test();
