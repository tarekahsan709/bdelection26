'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { ParallaxBackground } from '@/components/ui/ParallaxBackground';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Placeholder for error monitoring service (e.g., Sentry, LogRocket)
    if (process.env.NODE_ENV === 'production') {
      // Error logged: error.message, error.digest
    }
  }, [error]);

  return (
    <div className='min-h-screen bg-[#0c0c0c] relative'>
      <ParallaxBackground />
      <main className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center'>
        <div className='w-16 h-16 mb-6 text-red-500'>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.5}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
            />
          </svg>
        </div>
        <h1 className='text-3xl md:text-4xl font-bold text-white mb-3'>
          ওহ! কিছু একটা গোলমাল হয়েছে
        </h1>
        <p className='text-neutral-400 mb-8 max-w-md'>
          এটা সাময়িক সমস্যা। একটু পরে আবার চেষ্টা করুন।
        </p>
        <div className='flex gap-4'>
          <button
            onClick={reset}
            className='px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors'
          >
            পুনরায় চেষ্টা করুন
          </button>
          <Link
            href='/'
            className='px-6 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg font-medium transition-colors border border-white/10'
          >
            মানচিত্রে ফিরুন
          </Link>
        </div>
      </main>
    </div>
  );
}
