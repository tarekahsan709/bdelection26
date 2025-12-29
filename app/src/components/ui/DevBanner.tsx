'use client';

import { useState } from 'react';

const VERSION = '0.1.0';
const SHOW_DEV_BANNER = process.env.NEXT_PUBLIC_SHOW_DEV_BANNER === 'true';

export default function DevBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!SHOW_DEV_BANNER || !isVisible) return null;

  return (
    <div
      className='absolute top-0 left-0 right-0 bg-amber-500/90 backdrop-blur-sm'
      style={{ zIndex: 1000 }}
    >
      <div className='flex items-center justify-center gap-2 px-4 py-1.5 flex-wrap'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-black/30 animate-pulse' />
          <span className='text-[11px] font-semibold text-black/80'>
            Under Development
          </span>
          <span className='text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded text-black/60'>
            v{VERSION}
          </span>
        </div>

        <span className='text-black/30 hidden sm:inline'>|</span>

        <div className='flex items-center gap-3 text-[10px] text-black/70'>
          <span>Candidate data incomplete</span>
          <span className='hidden md:inline'>Some coordinates missing</span>
          <span className='hidden lg:inline'>Features in progress</span>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className='ml-2 p-1 hover:bg-black/10 rounded transition-colors'
          aria-label='বন্ধ করুন'
        >
          <svg
            className='w-3 h-3 text-black/50 hover:text-black/80'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
