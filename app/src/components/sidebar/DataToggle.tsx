'use client';

import { SIDEBAR_TEXT } from '@/constants/sidebar';

import type { DataMode } from '@/types/dot-density';

// =============================================================================
// Types
// =============================================================================

interface DataToggleProps {
  value: DataMode;
  onChange: (mode: DataMode) => void;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function ToggleButton({ active, onClick, label }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-teal-600 text-white'
          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
      }`}
    >
      {label}
    </button>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function DataToggle({ value, onChange }: DataToggleProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-300'>
        {SIDEBAR_TEXT.dataToggle.label}
      </label>
      <div className='flex gap-2'>
        <ToggleButton
          active={value === 'voters'}
          onClick={() => onChange('voters')}
          label={SIDEBAR_TEXT.dataToggle.voters}
        />
        <ToggleButton
          active={value === 'population'}
          onClick={() => onChange('population')}
          label={SIDEBAR_TEXT.dataToggle.population}
        />
      </div>
    </div>
  );
}
