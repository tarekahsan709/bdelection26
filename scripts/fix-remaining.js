const fs = require('fs');
const https = require('https');

// More spelling variations to try
const alternativeNames = {
  'Naogaon-1': ['Naogaon-1', 'Noagaon-1'],
  'Netrokona-5': ['Netrokona-5', 'Netrakona-5'],
  'Kishoreganj-3': ['Kishoreganj-3', 'Kishorganj-3'],
  'Munshiganj-3': ['Munshiganj-3', 'Munshigonj-3'],
  'Dhaka-13': ['Dhaka-13'],
  'Dhaka-14': ['Dhaka-14'],
  'Gazipur-6': ['Gazipur-6'],  // New constituency
  'Narayanganj-1': ['Narayanganj-1', 'Narayangonj-1'],
  'Narayanganj-3': ['Narayanganj-3', 'Narayangonj-3']
};

const constituenciesData = JSON.parse(fs.readFileSync('./bd-constituencies.json', 'utf8'));

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

const fixRemaining = async () => {
  const missing = constituenciesData.constituencies.filter(c => !c.registered_voters);
  console.log(`Trying to fix ${missing.length} remaining constituencies...\n`);

  let fixed = 0;

  for (const constituency of missing) {
    const alternatives = alternativeNames[constituency.name_english] || [constituency.name_english];

    for (const altName of alternatives) {
      await new Promise(r => setTimeout(r, 400));
      const result = await fetchData(altName);

      if (result && result.registered_voters) {
        constituency.registered_voters = result.registered_voters;
        if (result.lat) constituency.lat = result.lat;
        if (result.long) constituency.long = result.long;
        fixed++;
        console.log(`✓ ${constituency.name_english} (as ${altName}): ${result.registered_voters.toLocaleString()} voters`);
        break;
      }
    }

    if (!constituency.registered_voters) {
      console.log(`✗ ${constituency.name_english}: not found in DBpedia`);
    }
  }

  // Save
  constituenciesData.last_updated = new Date().toISOString().split('T')[0];
  fs.writeFileSync('./bd-constituencies.json', JSON.stringify(constituenciesData, null, 2));

  const withVoters = constituenciesData.constituencies.filter(c => c.registered_voters).length;
  console.log(`\nTotal with voter data: ${withVoters}/300`);

  // List still missing
  const stillMissing = constituenciesData.constituencies.filter(c => !c.registered_voters);
  if (stillMissing.length > 0) {
    console.log(`\nStill missing (${stillMissing.length}):`);
    stillMissing.forEach(c => console.log(`  - ${c.name_english} (ID: ${c.id})`));
  }
};

fixRemaining();
