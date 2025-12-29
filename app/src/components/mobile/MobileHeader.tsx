'use client';

import type { ConstituencyInfo } from '@/types/constituency';

interface MobileHeaderProps {
  onMenuClick: () => void;
  constituency: ConstituencyInfo | null;
}

export default function MobileHeader({
  onMenuClick,
  constituency,
}: MobileHeaderProps) {
  return (
    <header className='fixed top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 md:hidden pt-[env(safe-area-inset-top)]'>
      <div className='flex items-center justify-between px-2 h-14'>
        <button
          onClick={onMenuClick}
          className='w-11 h-11 flex items-center justify-center text-gray-400 active:text-white active:bg-white/10 rounded-lg'
          aria-label='Open menu'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
        <div className='flex-1 text-center px-2'>
          {constituency ? (
            <div>
              <p className='text-base font-semibold text-white truncate'>
                {constituency.name_english}
              </p>
              <p className='text-sm text-gray-400'>
                {constituency.district_english}
              </p>
            </div>
          ) : (
            <h1 className='text-base font-semibold text-white'>
              নির্বাচন ২০২৬
            </h1>
          )}
        </div>
        <div className='w-11' />
      </div>
    </header>
  );
}
