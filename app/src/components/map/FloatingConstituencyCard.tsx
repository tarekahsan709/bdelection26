'use client';

import type { ConstituencyInfo } from './ConstituencyLayer';

interface FloatingConstituencyCardProps {
  constituency: ConstituencyInfo | null;
  onClose: () => void;
  isSelected?: boolean;
}

export default function FloatingConstituencyCard({
  constituency,
  onClose,
  isSelected = false,
}: FloatingConstituencyCardProps) {
  if (!constituency) return null;

  const formatNumber = (num: number): string => {
    if (num >= 100000) {
      return (num / 100000).toFixed(1) + ' লক্ষ';
    }
    return num.toLocaleString('en-US');
  };

  return (
    <div className="absolute top-14 right-4 z-[1000] w-72">
      <div className={`bg-neutral-900/95 border rounded-xl backdrop-blur-sm shadow-2xl overflow-hidden transition-all ${
        isSelected ? 'border-teal-500/50' : 'border-neutral-800'
      }`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b border-neutral-800 ${
          isSelected ? 'bg-gradient-to-r from-teal-500/20 to-transparent' : 'bg-gradient-to-r from-teal-500/10 to-transparent'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {constituency.name || constituency.name_english}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {constituency.district || constituency.district_english}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-800 rounded-lg transition-colors ml-2"
            >
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-xs text-neutral-500">ভোটার সংখ্যা</div>
              <div className="text-lg font-bold text-teal-400 mt-1">
                {formatNumber(constituency.registered_voters)}
              </div>
            </div>
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-xs text-neutral-500">ধরন</div>
              <div className="text-lg font-bold text-white mt-1">
                {constituency.urban_classification === 'urban' ? (
                  <span className="text-cyan-400">শহর</span>
                ) : (
                  <span className="text-amber-400">গ্রাম</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{constituency.division || constituency.division_english} বিভাগ</span>
          </div>

          {/* Placeholder for candidates */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="text-xs text-neutral-600 text-center py-2">
              প্রার্থী তথ্য শীঘ্রই আসছে...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
