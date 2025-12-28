import { Metadata } from 'next';

import { siteConfig } from '@/constants/site';

interface ConstituencyMetadataParams {
  name: string;
  nameBn: string;
  district: string;
  division: string;
  voters?: number;
  url: string;
}

/**
 * Generate dynamic metadata for constituency pages
 */
export function generateConstituencyMetadata({
  name,
  nameBn,
  district,
  division,
  voters,
  url,
}: ConstituencyMetadataParams): Metadata {
  const title = `${name} (${nameBn}) - ${district}`;
  const description = voters
    ? `${name} নির্বাচনী এলাকার তথ্য। ${voters.toLocaleString('bn-BD')} ভোটার, প্রার্থী তালিকা, স্থানীয় সমস্যা এবং অবকাঠামো তথ্য। ${name} constituency information with ${voters.toLocaleString()} voters, candidate list, local issues, and infrastructure data.`
    : `${name} (${nameBn}) নির্বাচনী এলাকার তথ্য। ${division} বিভাগ, ${district} জেলা। Constituency information for ${name} in ${district}, ${division}.`;

  const fullUrl = `${siteConfig.url}${url}`;

  return {
    title,
    description,
    keywords: [
      name,
      nameBn,
      `${name} নির্বাচনী এলাকা`,
      `${name} constituency`,
      `${district} নির্বাচন`,
      `${district} election`,
      `${division} বিভাগ`,
      'Bangladesh Election 2026',
      'বাংলাদেশ নির্বাচন',
      'এমপি প্রার্থী',
      'MP candidates',
    ],
    openGraph: {
      title: `${name} - বাংলাদেশ নির্বাচন ২০২৬`,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/images/og.jpg`,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: `${name} constituency map`,
        },
      ],
      locale: siteConfig.locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - Bangladesh Election 2026`,
      description,
      images: [`${siteConfig.url}/images/og.jpg`],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

interface DivisionMetadataParams {
  name: string;
  nameBn: string;
  constituencyCount: number;
  totalVoters: number;
  url: string;
}

/**
 * Generate dynamic metadata for division pages
 */
export function generateDivisionMetadata({
  name,
  nameBn,
  constituencyCount,
  totalVoters,
  url,
}: DivisionMetadataParams): Metadata {
  const title = `${name} বিভাগ (${nameBn})`;
  const description = `${name} বিভাগের ${constituencyCount}টি নির্বাচনী এলাকা এবং ${totalVoters.toLocaleString('bn-BD')} ভোটারের তথ্য। ${name} division with ${constituencyCount} constituencies and ${totalVoters.toLocaleString()} voters.`;

  const fullUrl = `${siteConfig.url}${url}`;

  return {
    title,
    description,
    keywords: [
      name,
      nameBn,
      `${name} division`,
      `${name} বিভাগ`,
      `${name} election`,
      `${name} নির্বাচন`,
      'Bangladesh Election 2026',
      'বাংলাদেশ নির্বাচন',
    ],
    openGraph: {
      title: `${name} বিভাগ - বাংলাদেশ নির্বাচন ২০২৬`,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/images/og.jpg`,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: `${name} division map`,
        },
      ],
      locale: siteConfig.locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} Division - Bangladesh Election 2026`,
      description,
      images: [`${siteConfig.url}/images/og.jpg`],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}
