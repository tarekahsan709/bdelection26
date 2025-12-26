'use client';

import { DATA_COLORS } from '@/config/colors';

export default function LegendPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: DATA_COLORS.urban, boxShadow: `0 2px 4px ${DATA_COLORS.urban}50` }}
          />
          <span className="text-xs text-slate-400">শহর</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: DATA_COLORS.rural, boxShadow: `0 2px 4px ${DATA_COLORS.rural}50` }}
          />
          <span className="text-xs text-slate-400">গ্রাম</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        প্রতিটি বিন্দু প্রায় ৫,০০০ নিবন্ধিত ভোটার প্রতিনিধিত্ব করে
      </p>
    </div>
  );
}
