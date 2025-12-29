'use client';

import { memo, useMemo } from 'react';

import { useConstituencyData } from '@/contexts/ConstituencyDataContext';

import type { ConstituencyInfo } from '@/types/constituency';
import type { FilterState } from '@/types/map';

interface FilterPanelProps {
  value: FilterState;
  onChange: (filters: FilterState) => void;
  onConstituencySelect?: (constituency: ConstituencyInfo | null) => void;
  selectedConstituency?: ConstituencyInfo | null;
}

function FilterPanel({
  value,
  onChange,
  onConstituencySelect,
  selectedConstituency,
}: FilterPanelProps) {
  const { divisions, districts, constituencies } = useConstituencyData();

  const filteredDistricts = useMemo(() => {
    if (!value.divisionId) return [];
    return districts.filter((d) => d.division_id === value.divisionId);
  }, [districts, value.divisionId]);

  const filteredConstituencies = useMemo(() => {
    if (!value.districtId) return [];
    return constituencies.filter((c) => c.district_id === value.districtId);
  }, [constituencies, value.districtId]);

  const handleConstituencyChange = (constituencyId: string) => {
    if (!constituencyId || !onConstituencySelect) {
      onConstituencySelect?.(null);
      return;
    }
    const constituency = constituencies.find((c) => c.id === constituencyId);
    if (constituency) {
      onConstituencySelect(constituency);
    }
  };

  const selectClass = `
    w-full px-3 py-2.5 rounded-lg text-sm
    bg-white/[0.03] border border-white/[0.06]
    text-white/90 placeholder-neutral-600
    focus:outline-none focus:border-teal-500/30 focus:ring-1 focus:ring-teal-500/20
    hover:bg-white/[0.06]
    transition-all duration-200
    appearance-none cursor-pointer
  `;

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <select
          value={value.divisionId || ''}
          onChange={(e) => {
            onChange({
              divisionId: e.target.value || null,
              districtId: null,
            });
            onConstituencySelect?.(null);
          }}
          className={selectClass}
        >
          <option value=''>সব বিভাগ</option>
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>
              {div.bn_name || div.name}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      {value.divisionId && (
        <div className='relative'>
          <select
            value={value.districtId || ''}
            onChange={(e) => {
              onChange({
                ...value,
                districtId: e.target.value || null,
              });
              onConstituencySelect?.(null);
            }}
            className={selectClass}
          >
            <option value=''>সব জেলা</option>
            {filteredDistricts.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {dist.bn_name || dist.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      )}

      {value.districtId && filteredConstituencies.length > 0 && (
        <div className='relative'>
          <select
            value={selectedConstituency?.id || ''}
            onChange={(e) => handleConstituencyChange(e.target.value)}
            className={selectClass}
          >
            <option value=''>নির্বাচনী এলাকা বাছুন</option>
            {filteredConstituencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.name_english}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
      <svg
        className='w-4 h-4 text-neutral-500'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M19 9l-7 7-7-7'
        />
      </svg>
    </div>
  );
}

export default memo(FilterPanel);
