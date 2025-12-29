export const THEME = {
  background: '#0c0c0c',
  bodyBackground: '#080808',
} as const;

export const TOTAL_CONSTITUENCIES = 300;
export const TOTAL_CONSTITUENCIES_BN = '৩০০';
export const TOTAL_DIVISIONS = 8;
export const TOTAL_DISTRICTS = 64;

export const PRELOAD_DATA = [
  '/data/constituency-voters-2025.json',
  '/data/bd-divisions.json',
] as const;

export const TILE_SERVERS = {
  primary: 'https://a.tile.openstreetmap.org',
  secondary: 'https://b.tile.openstreetmap.org',
  tertiary: 'https://c.tile.openstreetmap.org',
} as const;

export const siteConfig = {
  /** Site name in both Bengali and English */
  name: 'Bangladesh Election Map',
  nameBn: 'বাংলাদেশ নির্বাচন মানচিত্র',

  /** Full site title for browser tabs and SEO */
  title: 'বাংলাদেশ নির্বাচন 2026 | Bangladesh Election 2026',

  /** Site description in both languages */
  description:
    'বাংলাদেশের 300 নির্বাচনী এলাকার ইন্টারেক্টিভ মানচিত্র। প্রার্থী, ভোটার সংখ্যা এবং জনতার দাবি দেখুন। Interactive map of 300 constituencies with candidates, voter data, and local issues.',
  descriptionEn:
    'Interactive map of Bangladesh featuring all 300 constituencies with candidates, voter statistics, and local issues for the upcoming 2026 election.',

  /** Site URL - configurable via environment variable */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bdelection.org',

  /** GitHub repository URL */
  github: 'https://github.com/tarekahsan709/bdelection26',

  /** Site keywords for SEO - comprehensive list */
  keywords: [
    // Bengali keywords
    'বাংলাদেশ নির্বাচন',
    'বাংলাদেশ নির্বাচন ২০২৬',
    'নির্বাচনী এলাকা',
    'ভোটার তালিকা',
    'প্রার্থী তালিকা',
    'নির্বাচন কমিশন',
    'জাতীয় সংসদ নির্বাচন',
    'সংসদ সদস্য',
    // English keywords
    'Bangladesh Election 2026',
    'Bangladesh constituency map',
    'Bangladesh voter data',
    'Bangladesh election candidates',
    'Bangladesh parliamentary election',
    'MP candidates Bangladesh',
    // Party names
    'BNP',
    'Bangladesh Nationalist Party',
    'জামায়াত',
    'Jamaat-e-Islami',
    'NCP',
    'এনসিপি',
  ],

  /** Primary locale */
  locale: 'bn_BD',

  /** Supported locales */
  locales: ['bn-BD', 'en-US'],

  /** Author information */
  author: {
    name: 'Bangladesh Election Map Contributors',
    url: 'https://github.com/tarekahsan709/bdelection26',
  },

  /** Open Graph image dimensions */
  ogImage: {
    width: 1200,
    height: 630,
    alt: 'Bangladesh Election 2026 - Interactive Constituency Map',
  },

  /** Twitter handle (if applicable) */
  twitter: {
    card: 'summary_large_image' as const,
    site: undefined, // Add @handle if available
    creator: undefined, // Add @handle if available
  },

  /** Verification codes for search engines (set via env vars) */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  },
};
