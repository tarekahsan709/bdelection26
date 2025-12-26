'use client';

import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

interface MobileHeaderProps {
  onMenuClick: () => void;
  constituency: ConstituencyInfo | null;
}

export default function MobileHeader({ onMenuClick, constituency }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-400 hover:text-white"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Title / Constituency name */}
        <div className="flex-1 text-center">
          {constituency ? (
            <div>
              <p className="text-sm font-semibold text-white truncate">
                {constituency.name_english}
              </p>
              <p className="text-xs text-gray-400">
                {constituency.district_english}
              </p>
            </div>
          ) : (
            <h1 className="text-sm font-semibold text-white">
              Bangladesh Election
            </h1>
          )}
        </div>

        {/* Placeholder for balance */}
        <div className="w-10" />
      </div>
    </header>
  );
}
