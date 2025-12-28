import { MetadataRoute } from 'next';

import { siteConfig } from '@/constant/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Generate constituency URLs for all 300 constituencies
  const constituencyUrls: MetadataRoute.Sitemap = Array.from(
    { length: 300 },
    (_, i) => ({
      url: `${baseUrl}/constituency/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...constituencyUrls,
  ];
}
