const fs = require('fs');
const https = require('https');

// Read existing constituencies
const constituenciesData = JSON.parse(fs.readFileSync('./bd-constituencies.json', 'utf8'));

// DBpedia URL pattern
const getDBpediaUrl = (name) => {
  // Convert "Panchagarh-1" to DBpedia format
  const formatted = name.replace(/\s+/g, '_');
  return `https://dbpedia.org/data/${formatted}.json`;
};

// Fetch data from DBpedia
const fetchConstituencyData = (constituency) => {
  return new Promise((resolve) => {
    const url = getDBpediaUrl(constituency.name_english);

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const resourceKey = `http://dbpedia.org/resource/${constituency.name_english.replace(/\s+/g, '_')}`;
          const resource = json[resourceKey];

          if (resource) {
            // Extract voter count
            const electorate = resource['http://dbpedia.org/property/electorate']?.[0]?.value ||
                              resource['http://dbpedia.org/ontology/populationTotal']?.[0]?.value;

            // Extract coordinates
            const lat = resource['http://www.w3.org/2003/01/geo/wgs84_pos#lat']?.[0]?.value;
            const long = resource['http://www.w3.org/2003/01/geo/wgs84_pos#long']?.[0]?.value;

            resolve({
              id: constituency.id,
              name_english: constituency.name_english,
              registered_voters: electorate ? parseInt(electorate) : null,
              lat: lat ? parseFloat(lat) : null,
              long: long ? parseFloat(long) : null,
              source: 'dbpedia'
            });
          } else {
            resolve({ id: constituency.id, name_english: constituency.name_english, error: 'not_found' });
          }
        } catch (e) {
          resolve({ id: constituency.id, name_english: constituency.name_english, error: e.message });
        }
      });
    }).on('error', (e) => {
      resolve({ id: constituency.id, name_english: constituency.name_english, error: e.message });
    });
  });
};

// Process all constituencies with delay to avoid rate limiting
const processAll = async () => {
  console.log(`Processing ${constituenciesData.constituencies.length} constituencies...`);

  const results = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < constituenciesData.constituencies.length; i++) {
    const constituency = constituenciesData.constituencies[i];

    // Add delay between requests (500ms)
    if (i > 0) await new Promise(r => setTimeout(r, 500));

    const result = await fetchConstituencyData(constituency);
    results.push(result);

    if (result.registered_voters) {
      success++;
      console.log(`[${i + 1}/300] ${result.name_english}: ${result.registered_voters.toLocaleString()} voters`);
    } else {
      failed++;
      console.log(`[${i + 1}/300] ${result.name_english}: ${result.error || 'no data'}`);
    }
  }

  // Save raw results
  fs.writeFileSync('./constituency-voter-data.json', JSON.stringify(results, null, 2));
  console.log(`\nDone! Success: ${success}, Failed: ${failed}`);
  console.log('Results saved to constituency-voter-data.json');

  // Update main constituencies file
  const updatedConstituencies = constituenciesData.constituencies.map(c => {
    const scraped = results.find(r => r.id === c.id);
    if (scraped && scraped.registered_voters) {
      return {
        ...c,
        registered_voters: scraped.registered_voters,
        ...(scraped.lat && { lat: scraped.lat }),
        ...(scraped.long && { long: scraped.long })
      };
    }
    return c;
  });

  const updatedData = {
    ...constituenciesData,
    last_updated: new Date().toISOString().split('T')[0],
    constituencies: updatedConstituencies
  };

  fs.writeFileSync('./bd-constituencies.json', JSON.stringify(updatedData, null, 2));
  console.log('Updated bd-constituencies.json with voter data');
};

processAll();
