'use client';

import type { DataMode } from '@/types/dot-density';

interface DataToggleProps {
  value: DataMode;
  onChange: (mode: DataMode) => void;
}

export default function DataToggle({ value, onChange }: DataToggleProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-gray-300'>Data Display</label>
      <div className='flex gap-2'>
        <button
          onClick={() => onChange('voters')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            value === 'voters'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Registered Voters
        </button>
        <button
          onClick={() => onChange('population')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            value === 'population'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Total Population
        </button>
      </div>
    </div>
  );
}
