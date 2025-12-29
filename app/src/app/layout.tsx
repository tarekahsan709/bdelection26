import { Metadata, Viewport } from 'next';
import { Noto_Sans_Bengali } from 'next/font/google';
import * as React from 'react';

import '@/styles/globals.css';
import '@/styles/colors.css';

import Providers from '@/components/Providers';
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd';

import { siteConfig } from '@/constants/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0c0c0c',
};

// Noto Sans Bengali - Clean, modern Bangla font by Google
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-bangla',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [siteConfig.author],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/og.jpg`,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt,
      },
    ],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/images/og.jpg`,
        alt: siteConfig.ogImage.alt,
      },
    ],
    site: siteConfig.twitter.site,
    creator: siteConfig.twitter.creator,
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'bn-BD': siteConfig.url,
      'en-US': siteConfig.url,
    },
  },
  verification: {
    google: siteConfig.verification.google,
    other: siteConfig.verification.bing
      ? { 'msvalidate.01': siteConfig.verification.bing }
      : undefined,
  },
  category: 'politics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='bn' className={notoSansBengali.variable}>
      <head>
        <link
          rel='preload'
          href='/data/constituency-voters-2025.json'
          as='fetch'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/data/bd-divisions.json'
          as='fetch'
          crossOrigin='anonymous'
        />
        <link rel='preconnect' href='https://a.tile.openstreetmap.org' />
        <link rel='preconnect' href='https://b.tile.openstreetmap.org' />
        <link rel='dns-prefetch' href='https://c.tile.openstreetmap.org' />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className='bg-[#080808] text-white antialiased font-bangla'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
