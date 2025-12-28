'use client';

import { useEffect, useState } from 'react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleOnline = () => {
      setIsOffline(false);
      setTimeout(() => setShowBanner(false), 2000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!mounted || !showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transition-transform duration-300 ${
        isOffline ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
          isOffline
            ? 'bg-red-900/95 text-red-100'
            : 'bg-green-900/95 text-green-100'
        }`}
      >
        {isOffline ? (
          <>
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
                d='M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656m-7.072 7.072a9 9 0 010-12.728m3.536 3.536a4 4 0 010 5.656'
              />
              <line x1='4' y1='4' x2='20' y2='20' strokeWidth={2} />
            </svg>
            <span>ইন্টারনেট সংযোগ নেই</span>
          </>
        ) : (
          <>
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
                d='M5 13l4 4L19 7'
              />
            </svg>
            <span>সংযোগ পুনঃস্থাপিত</span>
          </>
        )}
      </div>
    </div>
  );
}
