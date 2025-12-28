import { promises as fs } from 'fs';
import { MetadataRoute } from 'next';
import path from 'path';

import { getConstituencyUrl, slugify } from '@/lib/url-utils';

import { siteConfig } from '@/constants/site';

interface ConstituencyData {
  id: string;
  name_english: string;
  division_english: string;
  district_english: string;
}

interface VoterData {
  metadata: {
    updated_at: string;
  };
  constituencies: ConstituencyData[];
}

interface Division {
  name: string;
}

interface DivisionData {
  divisions: Division[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Read actual constituency data
  let constituencies: ConstituencyData[] = [];
  let divisions: Division[] = [];
  let lastUpdated = new Date('2025-12-28');

  try {
    const filePath = path.join(
      process.cwd(),
      'public/data/constituency-voters-2025.json',
    );
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: VoterData = JSON.parse(fileContent);
    constituencies = data.constituencies || [];
    if (data.metadata?.updated_at) {
      lastUpdated = new Date(data.metadata.updated_at);
    }
  } catch {
    constituencies = [];
  }

  try {
    const divPath = path.join(process.cwd(), 'public/data/bd-divisions.json');
    const divContent = await fs.readFile(divPath, 'utf-8');
    const divData: DivisionData = JSON.parse(divContent);
    divisions = divData.divisions || [];
  } catch {
    divisions = [];
  }

  // Generate division URLs
  const divisionUrls: MetadataRoute.Sitemap = divisions.map((d) => ({
    url: `${baseUrl}/${slugify(d.name)}`,
    lastModified: lastUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Generate constituency URLs from actual data
  const constituencyUrls: MetadataRoute.Sitemap = constituencies.map((c) => ({
    url: `${baseUrl}${getConstituencyUrl(c)}`,
    lastModified: lastUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/terms`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: lastUpdated,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...divisionUrls,
    ...constituencyUrls,
    ...staticPages,
  ];
}
