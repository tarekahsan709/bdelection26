const fs = require('fs');
const https = require('https');

// Mapping of our names to DBpedia names
const nameCorrections = {
  'Chapainawabganj-1': 'Chapai_Nawabganj-1',
  'Chapainawabganj-2': 'Chapai_Nawabganj-2',
  'Chapainawabganj-3': 'Chapai_Nawabganj-3',
  'Barishal-1': 'Barisal-1',
  'Barishal-2': 'Barisal-2',
  'Barishal-3': 'Barisal-3',
  'Barishal-4': 'Barisal-4',
  'Barishal-5': 'Barisal-5',
  'Barishal-6': 'Barisal-6',
  'Jhalokathi-1': 'Jhalokati-1',
  'Jhalokathi-2': 'Jhalokati-2',
  // Alternative spellings to try
  'Naogaon-1': 'Naogaon-1',
  'Netrokona-5': 'Netrokona-5',
  'Kishoreganj-3': 'Kishoreganj-3',
  'Munshiganj-3': 'Munshiganj-3',
  'Dhaka-13': 'Dhaka-13',
  'Dhaka-14': 'Dhaka-14',
  'Narayanganj-1': 'Narayanganj-1',
  'Narayanganj-3': 'Narayanganj-3',
  'Gazipur-6': 'Gazipur-6'
};

// Read existing data
const constituenciesData = JSON.parse(fs.readFileSync('./bd-constituencies.json', 'utf8'));
const voterData = JSON.parse(fs.readFileSync('./constituency-voter-data.json', 'utf8'));

// Find missing ones
const missing = voterData.filter(v => !v.registered_voters || v.error);
console.log(`Found ${missing.length} constituencies to fix:\n`);
missing.forEach(m => console.log(`  - ${m.name_english}: ${m.error || 'no data'}`));

// Fetch from DBpedia
const fetchData = (dbpediaName) => {
  return new Promise((resolve) => {
    const url = `https://dbpedia.org/data/${dbpediaName}.json`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const resourceKey = `http://dbpedia.org/resource/${dbpediaName}`;
          const resource = json[resourceKey];

          if (resource) {
            const electorate = resource['http://dbpedia.org/property/electorate']?.[0]?.value;
            const lat = resource['http://www.w3.org/2003/01/geo/wgs84_pos#lat']?.[0]?.value;
            const long = resource['http://www.w3.org/2003/01/geo/wgs84_pos#long']?.[0]?.value;

            resolve({
              registered_voters: electorate ? parseInt(electorate) : null,
              lat: lat ? parseFloat(lat) : null,
              long: long ? parseFloat(long) : null
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

const fixMissing = async () => {
  console.log('\nFetching with corrected spellings...\n');

  let fixed = 0;

  for (const item of missing) {
    const dbpediaName = nameCorrections[item.name_english] || item.name_english;

    await new Promise(r => setTimeout(r, 500)); // Rate limit

    const result = await fetchData(dbpediaName);

    if (result && result.registered_voters) {
      // Update in constituencies data
      const constituency = constituenciesData.constituencies.find(c => c.id === item.id);
      if (constituency) {
        constituency.registered_voters = result.registered_voters;
        if (result.lat) constituency.lat = result.lat;
        if (result.long) constituency.long = result.long;
        fixed++;
        console.log(`✓ ${item.name_english} (as ${dbpediaName}): ${result.registered_voters.toLocaleString()} voters`);
      }
    } else {
      console.log(`✗ ${item.name_english}: still not found`);
    }
  }

  // Save updated data
  constituenciesData.last_updated = new Date().toISOString().split('T')[0];
  fs.writeFileSync('./bd-constituencies.json', JSON.stringify(constituenciesData, null, 2));

  console.log(`\nFixed ${fixed} constituencies`);

  // Count total with voter data
  const withVoters = constituenciesData.constituencies.filter(c => c.registered_voters).length;
  console.log(`Total with voter data: ${withVoters}/300`);
};

fixMissing();
