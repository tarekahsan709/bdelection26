import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

import { siteConfig } from '@/constant/config';
import { getConstituencyUrl } from '@/lib/url-utils';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Read actual constituency data
  let constituencies: ConstituencyData[] = [];
  let lastUpdated = new Date('2025-12-28');

  try {
    const filePath = path.join(process.cwd(), 'public/data/constituency-voters-2025.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: VoterData = JSON.parse(fileContent);
    constituencies = data.constituencies || [];
    if (data.metadata?.updated_at) {
      lastUpdated = new Date(data.metadata.updated_at);
    }
  } catch {
    // Fallback: return empty array if file read fails (sitemap will just have home page)
    constituencies = [];
  }

  // Generate constituency URLs from actual data
  const constituencyUrls: MetadataRoute.Sitemap = constituencies.map((c) => ({
    url: `${baseUrl}${getConstituencyUrl(c)}`,
    lastModified: lastUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: lastUpdated,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...constituencyUrls,
  ];
}
