import { Metadata, Viewport } from 'next';
import { Noto_Sans_Bengali } from 'next/font/google';
import { ReactNode } from 'react';

import '@/styles/globals.css';
import '@/styles/colors.css';

import Providers from '@/components/Providers';
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd';

import {
  PRELOAD_DATA,
  siteConfig,
  THEME,
  TILE_SERVERS,
} from '@/constants/site';

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-bangla',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: THEME.background,
};

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
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='bn' className={notoSansBengali.variable}>
      <head>
        {PRELOAD_DATA.map((path) => (
          <link
            key={path}
            rel='preload'
            href={path}
            as='fetch'
            crossOrigin='anonymous'
          />
        ))}
        <link rel='preconnect' href={TILE_SERVERS.primary} />
        <link rel='preconnect' href={TILE_SERVERS.secondary} />
        <link rel='dns-prefetch' href={TILE_SERVERS.tertiary} />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body
        className='text-white antialiased font-bangla'
        style={{ backgroundColor: THEME.bodyBackground }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
