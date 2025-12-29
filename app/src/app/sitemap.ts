import { MetadataRoute } from 'next';

import { getConstituencyUrl, slugify } from '@/lib/url-utils';

import { siteConfig } from '@/constants/site';

import divisionData from '../../public/data/bd-divisions.json';
// Static imports - resolved at build time, works in standalone mode
import constituencyVoterData from '../../public/data/constituency-voters-2025.json';

interface ConstituencyData {
  id: string;
  name_english: string;
  division_english: string;
  district_english: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const lastUpdated = new Date(
    constituencyVoterData.metadata?.updated_at || '2025-12-28',
  );

  // Get constituencies from static import
  const constituencies = (constituencyVoterData.constituencies ||
    []) as ConstituencyData[];
  const divisions = divisionData.divisions || [];

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
