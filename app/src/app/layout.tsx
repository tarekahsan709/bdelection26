import { Metadata, Viewport } from 'next';
import { Noto_Sans_Bengali } from 'next/font/google';
import Link from 'next/link';
import * as React from 'react';

import '@/styles/globals.css';
import '@/styles/colors.css';

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
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className='bg-[#080808] text-white antialiased font-bangla'>
        {children}
        <Disclaimer />
      </body>
    </html>
  );
}

function Disclaimer() {
  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-amber-950/95 backdrop-blur-sm border-t border-amber-800/50 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]'>
      <div className='max-w-6xl mx-auto flex items-center justify-between gap-4 text-sm'>
        <div className='flex items-center gap-2 text-amber-200'>
          <svg
            className='w-4 h-4 shrink-0'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <span className='hidden sm:inline'>এটি সরকারি অ্যাপ নয়</span>
          <span className='sm:hidden'>সরকারি নয়</span>
        </div>
        <div className='flex items-center gap-1'>
          <Link
            href='/terms'
            className='px-2 py-1 min-h-11 flex items-center text-amber-300/80 active:text-amber-100'
          >
            শর্তাবলী
          </Link>
          <Link
            href='/privacy'
            className='px-2 py-1 min-h-11 flex items-center text-amber-300/80 active:text-amber-100'
          >
            গোপনীয়তা
          </Link>
          <a
            href='https://www.ecs.gov.bd'
            target='_blank'
            rel='noopener noreferrer'
            className='px-2 py-1 min-h-11 flex items-center gap-1 text-amber-300 active:text-amber-100'
          >
            <span className='hidden sm:inline'>নির্বাচন কমিশন</span>
            <span className='sm:hidden'>EC</span>
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
