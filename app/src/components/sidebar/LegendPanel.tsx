'use client';

import { DATA_COLORS } from '@/config/colors';

export default function LegendPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: DATA_COLORS.urban, boxShadow: `0 0 8px ${DATA_COLORS.urban}60` }}
          />
          <span className="text-xs text-neutral-400">শহর</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: DATA_COLORS.rural, boxShadow: `0 0 8px ${DATA_COLORS.rural}60` }}
          />
          <span className="text-xs text-neutral-400">গ্রাম</span>
        </div>
      </div>
      <p className="text-[11px] text-neutral-600 leading-relaxed">
        প্রতিটি বিন্দু প্রায় ৫,০০০ নিবন্ধিত ভোটার প্রতিনিধিত্ব করে
      </p>
    </div>
  );
}
