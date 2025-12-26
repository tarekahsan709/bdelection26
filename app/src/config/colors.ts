/**
 * Golden Delta Color Palette
 *
 * Inspired by Bangladesh's rivers, sunrise, and fertile land.
 * - Teal represents water (rivers)
 * - Gold represents harvest/hope
 * - Coral adds warmth
 * - Emerald for positive indicators
 */

// Core Palette
export const COLORS = {
  // Primary - Deep Teal (rivers, water)
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488', // Main primary
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Secondary - Warm Gold (harvest, hope)
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main secondary
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Accent - Coral (warmth, energy)
  accent: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171', // Main accent
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Success - Emerald (positive, growth)
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main success
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Background - Deep Navy (night sky, depth)
  background: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a', // Main background
    950: '#020617',
  },

  // Text colors
  text: {
    primary: '#f1f5f9',   // Warm white
    secondary: '#94a3b8', // Slate-400
    muted: '#64748b',     // Slate-500
    inverse: '#0f172a',   // Dark for light backgrounds
  },
} as const;

// Party Colors - Distinct from UI, for political data
export const PARTY_COLORS = {
  BNP: {
    color: '#10b981',     // Emerald - distinct from AL
    bg: 'rgba(16, 185, 129, 0.15)',
    name: 'BNP',
    fullName: 'Bangladesh Nationalist Party',
    fullNameBn: 'বাংলাদেশ জাতীয়তাবাদী দল',
  },
  Jamaat: {
    color: '#f59e0b',     // Gold/Amber - traditional
    bg: 'rgba(245, 158, 11, 0.15)',
    name: 'Jamaat',
    fullName: 'Jamaat-e-Islami',
    fullNameBn: 'জামায়াতে ইসলামী',
  },
  NCP: {
    color: '#8b5cf6',     // Violet - fresh, new party
    bg: 'rgba(139, 92, 246, 0.15)',
    name: 'NCP',
    fullName: 'National Congress Party',
    fullNameBn: 'জাতীয় কংগ্রেস পার্টি',
  },
  AL: {
    color: '#0d9488',     // Teal - distinct from flag green
    bg: 'rgba(13, 148, 136, 0.15)',
    name: 'AL',
    fullName: 'Awami League',
    fullNameBn: 'আওয়ামী লীগ',
  },
  JP: {
    color: '#eab308',     // Yellow - traditional
    bg: 'rgba(234, 179, 8, 0.15)',
    name: 'JP',
    fullName: 'Jatiya Party',
    fullNameBn: 'জাতীয় পার্টি',
  },
  Independent: {
    color: '#64748b',     // Slate - neutral
    bg: 'rgba(100, 116, 139, 0.15)',
    name: 'Independent',
    fullName: 'Independent',
    fullNameBn: 'স্বতন্ত্র',
  },
} as const;

// Semantic colors for data visualization
export const DATA_COLORS = {
  urban: '#0d9488',       // Teal - developed areas
  rural: '#f59e0b',       // Gold - agricultural areas
  positive: '#10b981',    // Emerald - good status
  warning: '#f59e0b',     // Gold - caution
  negative: '#f87171',    // Coral - needs attention
  neutral: '#64748b',     // Slate - neutral data
} as const;

// Chart colors (ordered for multi-series charts)
export const CHART_COLORS = [
  '#0d9488', // Teal
  '#f59e0b', // Gold
  '#10b981', // Emerald
  '#f87171', // Coral
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#84cc16', // Lime
] as const;

// CSS variable mappings for Tailwind
export const CSS_VARS = {
  '--color-primary': COLORS.primary[600],
  '--color-secondary': COLORS.secondary[500],
  '--color-accent': COLORS.accent[400],
  '--color-success': COLORS.success[500],
  '--color-background': COLORS.background[900],
  '--color-text': COLORS.text.primary,
} as const;
