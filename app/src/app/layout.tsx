import { siteConfig } from '@/constant/config';
import { Metadata } from 'next';
import { Noto_Sans_Bengali } from 'next/font/google';
import Link from 'next/link';
import * as React from 'react';

import '@/styles/globals.css';
import '@/styles/colors.css';

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
  robots: { index: true, follow: true },
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
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'bn-BD': siteConfig.url,
      'en-US': siteConfig.url,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={notoSansBengali.variable}>
      <body className="bg-[#080808] text-white antialiased font-bangla">
        {children}
        <Disclaimer />
      </body>
    </html>
  );
}

function Disclaimer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-9999 bg-amber-950/95 backdrop-blur-sm border-t border-amber-800/50 px-4 py-2">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-200">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>এটি সরকারি অ্যাপ নয় | Not an Official Government App</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/terms" className="text-amber-300/80 hover:text-amber-100">
            শর্তাবলী
          </Link>
          <span className="text-amber-800">|</span>
          <Link href="/privacy" className="text-amber-300/80 hover:text-amber-100">
            গোপনীয়তা
          </Link>
          <span className="text-amber-800">|</span>
          <a
            href="https://www.ecs.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-100 flex items-center gap-1"
          >
            নির্বাচন কমিশন
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
