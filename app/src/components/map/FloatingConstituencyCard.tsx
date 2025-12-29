'use client';

import { memo } from 'react';

import { formatLakhCount } from '@/lib/map-utils';

import { CloseIcon, LocationIcon } from '@/components/icons';

import type { ConstituencyInfo } from '@/types/constituency';

interface FloatingConstituencyCardProps {
  constituency: ConstituencyInfo | null;
  onClose: () => void;
  isSelected?: boolean;
}

export default memo(function FloatingConstituencyCard({
  constituency,
  onClose,
  isSelected = false,
}: FloatingConstituencyCardProps) {
  if (!constituency) return null;

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
              aria-label='বন্ধ করুন'
            >
              <CloseIcon className='w-5 h-5 text-neutral-500' />
            </button>
          </div>
        </div>
        <div className='p-4 space-y-3'>
          <div className='bg-neutral-800/50 rounded-lg p-3'>
            <div className='text-sm text-neutral-500'>ভোটার সংখ্যা</div>
            <div className='text-xl font-bold text-teal-400 mt-1'>
              {formatLakhCount(constituency.registered_voters)}
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm text-neutral-500'>
            <LocationIcon className='w-4 h-4' />
            <span>
              {constituency.division || constituency.division_english} বিভাগ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
