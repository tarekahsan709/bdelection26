export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function getConstituencyUrl(constituency: {
  division_english: string;
  district_english: string;
  name_english: string;
}): string {
  const division = slugify(constituency.division_english);
  const district = slugify(constituency.district_english);
  const name = slugify(constituency.name_english);
  return `/${division}/${district}/${name}`;
}
