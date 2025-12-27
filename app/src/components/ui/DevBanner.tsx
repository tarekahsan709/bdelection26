'use client';

import { useState } from 'react';

const VERSION = '0.1.0-beta';

export default function DevBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-neutral-900/95 border-b border-neutral-800 backdrop-blur-sm" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center gap-3 px-4 py-1.5">
        <div className="w-2 h-2 rounded-full bg-yellow-500/80 animate-pulse" />
        <span className="text-[11px] text-neutral-400">
          This site is under development
        </span>
        <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">
          v{VERSION}
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-1 p-1 hover:bg-neutral-800 rounded transition-colors"
          aria-label="Close"
        >
          <svg className="w-3 h-3 text-neutral-600 hover:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
