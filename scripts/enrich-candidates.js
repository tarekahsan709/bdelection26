const fs = require('fs');
const path = require('path');

// Load all reference data
const divisions = JSON.parse(fs.readFileSync(path.join(__dirname, 'map-geojson/bd-divisions.json'), 'utf8')).divisions;
const districts = JSON.parse(fs.readFileSync(path.join(__dirname, 'map-geojson/bd-districts.json'), 'utf8')).districts;
const upazilas = JSON.parse(fs.readFileSync(path.join(__dirname, 'map-geojson/bd-upazilas.json'), 'utf8')).upazilas;
const postcodes = JSON.parse(fs.readFileSync(path.join(__dirname, 'map-geojson/bd-postcodes.json'), 'utf8')).postcodes;

// Load BNP candidate data
const bnpData = JSON.parse(fs.readFileSync(path.join(__dirname, 'bnp_candidates.json'), 'utf8'));

// Create lookup maps
const divisionMap = {};
divisions.forEach(d => {
  divisionMap[d.id] = d;
});

const districtMap = {};
const districtByName = {};
const districtByBnName = {};
districts.forEach(d => {
  districtMap[d.id] = d;
  districtByName[d.name.toLowerCase()] = d;
  districtByBnName[d.bn_name] = d;
});

const upazilaMap = {};
const upazilaByDistrictAndName = {};
upazilas.forEach(u => {
  upazilaMap[u.id] = u;
  const key = `${u.district_id}_${u.name.toLowerCase()}`;
  upazilaByDistrictAndName[key] = u;
  // Also add bn_name key
  const bnKey = `${u.district_id}_${u.bn_name}`;
  upazilaByDistrictAndName[bnKey] = u;
});

// Create postcode lookup by upazila
const postcodeByUpazila = {};
postcodes.forEach(p => {
  const key = `${p.district_id}_${p.upazila.toLowerCase()}`;
  if (!postcodeByUpazila[key]) {
    postcodeByUpazila[key] = [];
  }
  if (!postcodeByUpazila[key].includes(p.postCode)) {
    postcodeByUpazila[key].push(p.postCode);
  }
});

// District name mapping (constituency name to district)
const constituencyToDistrict = {
  'পঞ্চগড়': 'Panchagarh',
  'ঠাকুরগাঁও': 'Thakurgaon',
  'দিনাজপুর': 'Dinajpur',
  'নীলফামারী': 'Nilphamari',
  'লালমনিরহাট': 'Lalmonirhat',
  'রংপুর': 'Rangpur',
  'কুড়িগ্রাম': 'Kurigram',
  'গাইবান্ধা': 'Gaibandha',
  'বগুড়া': 'Bogura',
  'জয়পুরহাট': 'Joypurhat',
  'নওগাঁ': 'Naogaon',
  'নাটোর': 'Natore',
  'রাজশাহী': 'Rajshahi',
  'নবাবগঞ্জ': 'Nawabganj',
  'চাঁপাইনবাবগঞ্জ': 'Nawabganj',
  'পাবনা': 'Pabna',
  'সিরাজগঞ্জ': 'Sirajgonj',
  'কুষ্টিয়া': 'Kushtia',
  'মেহেরপুর': 'Meherpur',
  'চুয়াডাঙ্গা': 'Chuadanga',
  'ঝিনাইদহ': 'Jhenaidah',
  'মাগুরা': 'Magura',
  'নড়াইল': 'Narail',
  'যশোর': 'Jashore',
  'সাতক্ষীরা': 'Satkhira',
  'খুলনা': 'Khulna',
  'বাগেরহাট': 'Bagerhat',
  'পিরোজপুর': 'Pirojpur',
  'ঝালকাঠি': 'Jhalokati',
  'বরিশাল': 'Barishal',
  'বরগুনা': 'Barguna',
  'পটুয়াখালী': 'Patuakhali',
  'ভোলা': 'Bhola',
  'গোপালগঞ্জ': 'Gopalganj',
  'মাদারীপুর': 'Madaripur',
  'শরীয়তপুর': 'Shariatpur',
  'ফরিদপুর': 'Faridpur',
  'রাজবাড়ি': 'Rajbari',
  'রাজবাড়ী': 'Rajbari',
  'টাঙ্গাইল': 'Tangail',
  'ময়মনসিংহ': 'Mymensingh',
  'জামালপুর': 'Jamalpur',
  'শেরপুর': 'Sherpur',
  'নেত্রকোণা': 'Netrokona',
  'নেত্রকোনা': 'Netrokona',
  'কিশোরগঞ্জ': 'Kishoreganj',
  'মানিকগঞ্জ': 'Manikganj',
  'মুন্সিগঞ্জ': 'Munshiganj',
  'মুন্সীগঞ্জ': 'Munshiganj',
  'ঢাকা': 'Dhaka',
  'নারায়াণগঞ্জ': 'Narayanganj',
  'নারায়ণগঞ্জ': 'Narayanganj',
  'নরসিংদী': 'Narsingdi',
  'গাজীপুর': 'Gazipur',
  'সুনামগঞ্জ': 'Sunamganj',
  'সিলেট': 'Sylhet',
  'মৌলভীবাজার': 'Maulvibazar',
  'হবিগঞ্জ': 'Habiganj',
  'ব্রাহ্মণবাড়িয়া': 'Brahmanbaria',
  'কুমিল্লা': 'Cumilla',
  'চাঁদপুর': 'Chandpur',
  'ফেনী': 'Feni',
  'নোয়াখালী': 'Noakhali',
  'লক্ষীপুর': 'Lakshmipur',
  'চট্টগ্রাম': 'Chattogram',
  'কক্সবাজার': 'Cox\'s Bazar',
  'খাগড়াছড়ি': 'Khagrachari',
  'রাঙ্গামাটি': 'Rangamati',
  'বান্দরবান': 'Bandarban'
};

// Function to extract district name from constituency
function extractDistrictFromConstituency(constituency) {
  // Remove numbers and hyphens, e.g., "পঞ্চগড় -১" -> "পঞ্চগড়"
  const cleaned = constituency.replace(/[\s-]*[\d০১২৩৪৫৬৭৮৯]+$/, '').trim();
  return cleaned;
}

// Function to find district by Bengali name
function findDistrict(bnName) {
  const englishName = constituencyToDistrict[bnName];
  if (englishName) {
    const district = districtByName[englishName.toLowerCase()];
    if (district) return district;
  }
  // Try direct bn_name match
  if (districtByBnName[bnName]) {
    return districtByBnName[bnName];
  }
  return null;
}

// Function to determine area type
function getAreaType(areaText) {
  if (typeof areaText !== 'string') {
    return areaText.type || 'other';
  }
  if (areaText.includes('সিটি কর্পোরেশন') || areaText.includes('City Corporation')) {
    return 'city_corporation_ward';
  }
  if (areaText.includes('পৌরসভা') || areaText.includes('Municipality')) {
    return 'municipality';
  }
  if (areaText.includes('ইউনিয়ন') || areaText.includes('Union')) {
    return 'union';
  }
  if (areaText.includes('উপজেলা') || areaText.includes('Upazila')) {
    return 'upazila';
  }
  if (areaText.includes('পার্বত্য জেলা') || areaText.includes('Hill District')) {
    return 'hill_district';
  }
  return 'other';
}

// Check if data is already enriched
function isAlreadyEnriched(candidate) {
  return candidate.areas && candidate.areas.length > 0 && typeof candidate.areas[0] === 'object';
}

// Function to extract upazila name from area text
function extractUpazilaName(areaText) {
  // Remove "উপজেলা" suffix and clean up
  let name = areaText.replace(/\s*উপজেলা.*$/, '').trim();
  name = name.replace(/^\(ক\)\s*/, '').replace(/^\(খ\)\s*/, '').replace(/^\(গ\)\s*/, '').trim();
  return name;
}

// Function to find upazila
function findUpazila(districtId, areaText, areaTextEnglish) {
  // Try to find by English name first
  if (areaTextEnglish) {
    const englishName = areaTextEnglish.replace(/\s*Upazila.*$/i, '').trim();
    const key = `${districtId}_${englishName.toLowerCase()}`;
    if (upazilaByDistrictAndName[key]) {
      return upazilaByDistrictAndName[key];
    }
  }

  // Try Bengali name
  const bnName = extractUpazilaName(areaText);
  const bnKey = `${districtId}_${bnName}`;
  if (upazilaByDistrictAndName[bnKey]) {
    return upazilaByDistrictAndName[bnKey];
  }

  return null;
}

// Function to get postcodes for an upazila
function getPostcodes(districtId, upazilaName) {
  const key = `${districtId}_${upazilaName.toLowerCase()}`;
  return postcodeByUpazila[key] || [];
}

// Process each candidate
const enrichedCandidates = bnpData.candidates.map(candidate => {
  const districtBnName = extractDistrictFromConstituency(candidate.constituency);
  const district = findDistrict(districtBnName);

  let division = null;
  let enrichedAreas = [];

  // Check if already enriched (areas are objects)
  const alreadyEnriched = isAlreadyEnriched(candidate);

  if (district) {
    division = divisionMap[district.division_id];

    // Process areas
    for (let i = 0; i < candidate.areas.length; i++) {
      let areaBn, areaEn, areaType;

      if (alreadyEnriched) {
        // Data is already enriched, just update district/division info
        const existingArea = candidate.areas[i];
        areaBn = existingArea.name;
        areaEn = existingArea.name_english;
        areaType = existingArea.type;

        // Keep existing enriched area but try to add missing upazila_id/postcodes
        let enrichedArea = { ...existingArea };

        if (areaType === 'upazila' && !existingArea.upazila_id) {
          const upazila = findUpazila(district.id, areaBn, areaEn);
          if (upazila) {
            enrichedArea.upazila_id = upazila.id;
            const pcs = getPostcodes(district.id, upazila.name);
            if (pcs.length > 0) {
              enrichedArea.postcodes = pcs;
            }
          }
        }
        enrichedAreas.push(enrichedArea);
      } else {
        areaBn = candidate.areas[i];
        areaEn = candidate.areas_english ? candidate.areas_english[i] : null;
        areaType = getAreaType(areaBn);

        let enrichedArea = {
          type: areaType,
          name: areaBn,
          name_english: areaEn || ''
        };

        if (areaType === 'upazila') {
          const upazila = findUpazila(district.id, areaBn, areaEn);
          if (upazila) {
            enrichedArea.upazila_id = upazila.id;
            const pcs = getPostcodes(district.id, upazila.name);
            if (pcs.length > 0) {
              enrichedArea.postcodes = pcs;
            }
          }
        }
        enrichedAreas.push(enrichedArea);
      }
    }
  } else {
    // Keep original areas if district not found
    if (alreadyEnriched) {
      enrichedAreas = candidate.areas;
    } else {
      enrichedAreas = candidate.areas.map((area, i) => ({
        type: getAreaType(area),
        name: area,
        name_english: candidate.areas_english ? candidate.areas_english[i] : ''
      }));
    }
  }

  return {
    candidate_id: candidate.candidate_id,
    serial: candidate.serial,
    constituency_id: candidate.serial,
    constituency: candidate.constituency,
    constituency_english: candidate.constituency_english,
    division_id: division ? division.id : null,
    division: division ? division.bn_name : null,
    division_english: division ? division.name : null,
    district_id: district ? district.id : null,
    district: district ? district.bn_name : null,
    district_english: district ? district.name : null,
    areas: enrichedAreas,
    candidate_name: candidate.candidate_name,
    candidate_name_english: candidate.candidate_name_english
  };
});

// Create enriched data object
const enrichedData = {
  party: bnpData.party,
  party_full_name: bnpData.party_full_name,
  party_bengali: bnpData.party_bengali,
  document_date: bnpData.document_date,
  candidates: enrichedCandidates
};

// Write enriched data
fs.writeFileSync(
  path.join(__dirname, 'bnp_candidates.json'),
  JSON.stringify(enrichedData, null, 2),
  'utf8'
);

console.log('Data enrichment complete!');
console.log(`Total candidates: ${enrichedCandidates.length}`);

// Count statistics
let withDistrict = 0;
let withUpazila = 0;
let withPostcodes = 0;

enrichedCandidates.forEach(c => {
  if (c.district_id) withDistrict++;
  c.areas.forEach(a => {
    if (a.upazila_id) withUpazila++;
    if (a.postcodes && a.postcodes.length > 0) withPostcodes++;
  });
});

console.log(`Candidates with district matched: ${withDistrict}`);
console.log(`Areas with upazila matched: ${withUpazila}`);
console.log(`Areas with postcodes: ${withPostcodes}`);
