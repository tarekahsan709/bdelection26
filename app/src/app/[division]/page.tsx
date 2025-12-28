import { promises as fs } from 'fs';
import { Metadata } from 'next';
import path from 'path';

import { generateDivisionMetadata } from '@/lib/metadata';
import { slugify } from '@/lib/url-utils';

import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

import { siteConfig } from '@/constants/site';

import DivisionClient from './DivisionClient';

interface Division {
  id: string;
  name: string;
  bn_name: string;
}

interface DivisionData {
  divisions: Division[];
}

interface Constituency {
  division_english: string;
  registered_voters: number;
}

interface VoterData {
  constituencies: Constituency[];
}

interface PageProps {
  params: Promise<{
    division: string;
  }>;
}

async function getDivisionData(
  divisionSlug: string,
): Promise<{
  division: Division;
  constituencyCount: number;
  totalVoters: number;
} | null> {
  try {
    // Get division info
    const divPath = path.join(process.cwd(), 'public/data/bd-divisions.json');
    const divContent = await fs.readFile(divPath, 'utf-8');
    const divData: DivisionData = JSON.parse(divContent);
    const division = divData.divisions.find(
      (d) => slugify(d.name) === divisionSlug,
    );

    if (!division) return null;

    // Get constituency stats
    const voterPath = path.join(
      process.cwd(),
      'public/data/constituency-voters-2025.json',
    );
    const voterContent = await fs.readFile(voterPath, 'utf-8');
    const voterData: VoterData = JSON.parse(voterContent);

    const divisionConstituencies = voterData.constituencies.filter(
      (c) => slugify(c.division_english) === divisionSlug,
    );

    return {
      division,
      constituencyCount: divisionConstituencies.length,
      totalVoters: divisionConstituencies.reduce(
        (sum, c) => sum + c.registered_voters,
        0,
      ),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { division } = await params;
  const data = await getDivisionData(division);

  if (!data) {
    return {
      title: 'Division Not Found',
    };
  }

  return generateDivisionMetadata({
    name: data.division.name,
    nameBn: data.division.bn_name,
    constituencyCount: data.constituencyCount,
    totalVoters: data.totalVoters,
    url: `/${division}`,
  });
}

export default async function DivisionPage({ params }: PageProps) {
  const { division } = await params;
  const data = await getDivisionData(division);

  const breadcrumbItems = [
    { name: 'হোম', url: siteConfig.url },
    {
      name: data?.division.name || 'Division',
      url: `${siteConfig.url}/${division}`,
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <DivisionClient />
    </>
  );
}
