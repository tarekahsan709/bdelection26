import { siteConfig } from '@/constants/site';

interface JsonLdProps {
  type: 'website' | 'organization' | 'breadcrumb' | 'constituency';
  data?: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteConfig.title,
          description: siteConfig.description,
          url: siteConfig.url,
          inLanguage: ['bn-BD', 'en-US'],
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${siteConfig.url}/?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Bangladesh Election Map',
          url: siteConfig.url,
          logo: `${siteConfig.url}/favicon/android-chrome-512x512.png`,
          description: siteConfig.description,
          sameAs: [siteConfig.github],
        };

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.items || [],
        };

      case 'constituency':
        return {
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: data?.name,
          description: data?.description,
          address: {
            '@type': 'PostalAddress',
            addressRegion: data?.district,
            addressCountry: 'BD',
          },
          geo: data?.coordinates
            ? {
                '@type': 'GeoCoordinates',
                latitude: (data.coordinates as { lat: number; lng: number })
                  .lat,
                longitude: (data.coordinates as { lat: number; lng: number })
                  .lng,
              }
            : undefined,
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: data?.division,
          },
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Pre-configured components for common use cases
export function WebsiteJsonLd() {
  return <JsonLd type='website' />;
}

export function OrganizationJsonLd() {
  return <JsonLd type='organization' />;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbItems = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return <JsonLd type='breadcrumb' data={{ items: breadcrumbItems }} />;
}

interface ConstituencyJsonLdProps {
  name: string;
  description: string;
  division: string;
  district: string;
  coordinates?: { lat: number; lng: number };
}

export function ConstituencyJsonLd(props: ConstituencyJsonLdProps) {
  return (
    <JsonLd
      type='constituency'
      data={props as unknown as Record<string, unknown>}
    />
  );
}
