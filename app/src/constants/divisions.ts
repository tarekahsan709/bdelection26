/**
 * Golden Delta Color Palette
 * Based on teal (rivers), gold (harvest), emerald (growth), coral (warmth)
 */
export const COLOR_PALETTE = [
  '#0d9488', // Teal-600 (primary)
  '#f59e0b', // Amber-500 (secondary)
  '#10b981', // Emerald-500 (success)
  '#f87171', // Red-400 (accent/coral)
  '#14b8a6', // Teal-500
  '#d97706', // Amber-600
  '#059669', // Emerald-600
  '#0f766e', // Teal-700
  '#fbbf24', // Amber-400
  '#34d399', // Emerald-400
  '#0d9488', // Teal-600 repeat with different distribution
  '#f59e0b', // Amber-500 repeat
  '#10b981', // Emerald-500 repeat
  '#f87171', // Coral repeat
  '#2dd4bf', // Teal-400 (lighter)
  '#fcd34d', // Amber-300 (lighter)
];

// Division colors (Golden Delta themed)
export const DIVISION_COLORS: Record<string, { color: string; name: string; nameBn: string }> = {
  '1': { color: '#0d9488', name: 'Barishal', nameBn: 'বরিশাল' },
  '2': { color: '#f59e0b', name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  '3': { color: '#10b981', name: 'Dhaka', nameBn: 'ঢাকা' },
  '4': { color: '#14b8a6', name: 'Khulna', nameBn: 'খুলনা' },
  '5': { color: '#d97706', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  '6': { color: '#059669', name: 'Rangpur', nameBn: 'রংপুর' },
  '7': { color: '#fbbf24', name: 'Sylhet', nameBn: 'সিলেট' },
  '8': { color: '#0f766e', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
};

// Generate deterministic color for constituency (same constituency always gets same color)
export function getConstituencyColor(constituencyId: string): string {
  // Use constituency ID as seed for deterministic random color
  const hash = constituencyId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

export const DEFAULT_DIVISION_COLOR = '#9e9e9e';
