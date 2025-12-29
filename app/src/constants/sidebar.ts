/**
 * Sidebar Constants
 *
 * Centralized configuration for sidebar components.
 */

// =============================================================================
// UI Configuration
// =============================================================================

export const SIDEBAR_UI = {
  /** Width of the sidebar */
  WIDTH: 320, // w-80 = 20rem = 320px

  /** Number of skeleton cards in stats loading state */
  STATS_SKELETON_COUNT: 4,

  /** Dot density representation (voters per dot) */
  VOTERS_PER_DOT: 5000,
} as const;

// =============================================================================
// Bengali Text Labels
// =============================================================================

export const SIDEBAR_TEXT = {
  /** Header */
  header: {
    title: 'জনতার নির্বাচন ২০২৬',
    subtitle: 'জনগণই সকল ক্ষমতার উৎস',
  },

  /** Section titles */
  sections: {
    regionFilter: 'অঞ্চল ফিল্টার',
    statistics: 'পরিসংখ্যান',
    legend: 'লিজেন্ড',
  },

  /** Filter placeholders */
  filters: {
    allDivisions: 'সব বিভাগ',
    allDistricts: 'সব জেলা',
    selectConstituency: 'নির্বাচনী এলাকা বাছুন',
  },

  /** Stats labels */
  stats: {
    totalVoters: 'মোট ভোটার',
    constituencies: 'নির্বাচনী এলাকা',
    male: 'পুরুষ',
    female: 'নারী',
    voters: 'ভোটার',
  },

  /** Legend */
  legend: {
    voterDensity: 'ভোটার ঘনত্ব',
    dotDescription:
      'প্রতিটি বিন্দু প্রায় 5,000 নিবন্ধিত ভোটার প্রতিনিধিত্ব করে',
  },

  /** Footer */
  footer: {
    disclaimer: 'এটি সরকারি অ্যাপ নয়',
    terms: 'শর্তাবলী',
    privacy: 'গোপনীয়তা',
    source: 'তথ্য সূত্র: বাংলাদেশ নির্বাচন কমিশন',
  },

  /** Constituency detail */
  constituency: {
    registeredVoters: 'নিবন্ধিত ভোটার',
    classification: 'শ্রেণীবিভাগ',
    candidates: 'প্রার্থী',
    loadingCandidates: 'প্রার্থী লোড হচ্ছে...',
    noCandidates: 'এই আসনে কোনো প্রার্থী পাওয়া যায়নি',
  },

  /** Data toggle */
  dataToggle: {
    label: 'ডেটা প্রদর্শন',
    voters: 'নিবন্ধিত ভোটার',
    population: 'মোট জনসংখ্যা',
  },
} as const;

// =============================================================================
// External Links
// =============================================================================

export const EXTERNAL_LINKS = {
  electionCommission: 'https://www.ecs.gov.bd',
} as const;

// =============================================================================
// Style Classes (Shared)
// =============================================================================

export const SIDEBAR_STYLES = {
  /** Select input styling */
  select: `
    w-full px-3 py-2.5 rounded-lg text-sm
    bg-white/[0.03] border border-white/[0.06]
    text-white/90 placeholder-neutral-600
    focus:outline-none focus:border-teal-500/30 focus:ring-1 focus:ring-teal-500/20
    hover:bg-white/[0.06]
    transition-all duration-200
    appearance-none cursor-pointer
  `.trim(),

  /** Divider styling */
  divider: 'mx-5 h-px bg-white/[0.04]',

  /** Section container */
  section: 'px-5 py-4',
} as const;

// =============================================================================
// Accent Colors
// =============================================================================

export const STAT_ACCENTS = {
  white: 'text-white',
  teal: 'text-teal-400',
  amber: 'text-amber-400',
} as const;

export type StatAccent = keyof typeof STAT_ACCENTS;
