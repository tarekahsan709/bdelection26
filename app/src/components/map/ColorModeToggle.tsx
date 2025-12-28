'use client';

import {PARTY_COLORS } from '@/constants/colors';

import type { ColorMode } from './DotLayer';

interface ColorModeToggleProps {
  colorMode: ColorMode;
  onChange: (mode: ColorMode) => void;
}

export default function ColorModeToggle({ colorMode, onChange }: ColorModeToggleProps) {
  return (
    <div className="absolute top-14 right-[300px] z-[1000] hidden md:block">
      <div className="bg-neutral-900/95 border border-neutral-800 rounded-lg backdrop-blur-sm overflow-hidden">
        <div className="flex">
          <button
            onClick={() => onChange('area')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              colorMode === 'area'
                ? 'bg-teal-500/20 text-teal-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-teal-500"
                />
              </div>
              <span>এলাকা</span>
            </div>
          </button>
          <div className="w-px bg-neutral-800" />
          <button
            onClick={() => onChange('party')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              colorMode === 'party'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: PARTY_COLORS.BNP.color }}
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: PARTY_COLORS.Jamaat.color }}
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: PARTY_COLORS.NCP.color }}
                />
              </div>
              <span>দল</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
