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
    <div className='hidden md:block absolute top-14 right-4 z-1000 w-72'>
      <div
        className={`bg-neutral-900/95 border rounded-xl backdrop-blur-sm shadow-2xl overflow-hidden ${
          isSelected ? 'border-teal-500/50' : 'border-neutral-800'
        }`}
      >
        <div
          className={`px-4 py-3 border-b border-neutral-800 ${
            isSelected
              ? 'bg-linear-to-r from-teal-500/20 to-transparent'
              : 'bg-linear-to-r from-teal-500/10 to-transparent'
          }`}
        >
          <div className='flex items-start justify-between gap-2'>
            <div className='flex-1 min-w-0'>
              <h3 className='text-base font-bold text-white truncate'>
                {constituency.name || constituency.name_english}
              </h3>
              <p className='text-sm text-neutral-500 mt-0.5'>
                {constituency.district || constituency.district_english}
              </p>
            </div>
            <button
              onClick={onClose}
              className='w-9 h-9 flex items-center justify-center hover:bg-neutral-800 rounded-lg'
              aria-label='Close'
            >
              <svg
                className='w-5 h-5 text-neutral-500'
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
        <div className='p-4 space-y-3'>
          <div className='bg-neutral-800/50 rounded-lg p-3'>
            <div className='text-sm text-neutral-500'>ভোটার সংখ্যা</div>
            <div className='text-xl font-bold text-teal-400 mt-1'>
              {formatNumber(constituency.registered_voters)}
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm text-neutral-500'>
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            <span>
              {constituency.division || constituency.division_english} বিভাগ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
