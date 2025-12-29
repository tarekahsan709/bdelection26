'use client';

import { SIDEBAR_TEXT } from '@/constants/sidebar';

export default function LegendPanel() {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <div
          className='w-3 h-3 rounded-full bg-teal-500'
          style={{ boxShadow: '0 0 8px rgba(20, 184, 166, 0.6)' }}
        />
        <span className='text-xs text-neutral-400'>
          {SIDEBAR_TEXT.legend.voterDensity}
        </span>
      </div>
      <p className='text-[11px] text-neutral-600 leading-relaxed'>
        {SIDEBAR_TEXT.legend.dotDescription}
      </p>
    </div>
  );
}
