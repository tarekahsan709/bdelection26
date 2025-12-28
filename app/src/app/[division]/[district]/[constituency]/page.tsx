import { promises as fs } from 'fs';
import { Metadata } from 'next';
import path from 'path';

import { generateConstituencyMetadata } from '@/lib/metadata';
import { getConstituencyUrl, slugify } from '@/lib/url-utils';

import { BreadcrumbJsonLd, ConstituencyJsonLd } from '@/components/seo/JsonLd';

import { siteConfig } from '@/constants/site';

import ConstituencyClient from './ConstituencyClient';

interface ConstituencyData {
  id: string;
  name_english: string;
  name: string;
  division_english: string;
  district_english: string;
  registered_voters: number;
}

interface VoterData {
  constituencies: ConstituencyData[];
}

interface PageProps {
  params: Promise<{
    division: string;
    district: string;
    constituency: string;
  }>;
}

async function getConstituencyData(
  divisionSlug: string,
  districtSlug: string,
  constituencySlug: string,
): Promise<ConstituencyData | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      'public/data/constituency-voters-2025.json',
    );
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: VoterData = JSON.parse(fileContent);

    return (
      data.constituencies.find(
        (c) =>
          slugify(c.division_english) === divisionSlug &&
          slugify(c.district_english) === districtSlug &&
          slugify(c.name_english) === constituencySlug,
      ) || null
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { division, district, constituency } = await params;
  const data = await getConstituencyData(division, district, constituency);

  if (!data) {
    return {
      title: 'Constituency Not Found',
    };
  }

  return generateConstituencyMetadata({
    name: data.name_english,
    nameBn: data.name,
    district: data.district_english,
    division: data.division_english,
    voters: data.registered_voters,
    url: getConstituencyUrl(data),
  });
}

export default async function ConstituencyPage({ params }: PageProps) {
  const { division, district, constituency } = await params;
  const data = await getConstituencyData(division, district, constituency);

  const breadcrumbItems = [
    { name: 'হোম', url: siteConfig.url },
    {
      name: data?.division_english || 'Division',
      url: `${siteConfig.url}/${division}`,
    },
    {
      name: data?.district_english || 'District',
      url: `${siteConfig.url}/${division}/${district}`,
    },
    {
      name: data?.name_english || 'Constituency',
      url: `${siteConfig.url}/${division}/${district}/${constituency}`,
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {data && (
        <ConstituencyJsonLd
          name={data.name_english}
          description={`${data.name_english} (${data.name}) constituency in ${data.district_english}, ${data.division_english} division`}
          division={data.division_english}
          district={data.district_english}
        />
      )}
      <ConstituencyClient />
    </>
  );
}
