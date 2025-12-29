'use client';

import { memo, useMemo } from 'react';

import { ChevronDownIcon } from '@/components/icons';

import { SIDEBAR_STYLES, SIDEBAR_TEXT } from '@/constants/sidebar';
import { useConstituencyData } from '@/contexts/ConstituencyDataContext';

import type { ConstituencyInfo } from '@/types/constituency';
import type { FilterState } from '@/types/map';

// =============================================================================
// Types
// =============================================================================

interface FilterPanelProps {
  value: FilterState;
  onChange: (filters: FilterState) => void;
  onConstituencySelect?: (constituency: ConstituencyInfo | null) => void;
  selectedConstituency?: ConstituencyInfo | null;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface SelectWrapperProps {
  children: React.ReactNode;
}

function SelectWrapper({ children }: SelectWrapperProps) {
  return (
    <div className='relative'>
      {children}
      <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
        <ChevronDownIcon className='w-4 h-4 text-neutral-500' />
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

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

  const handleDivisionChange = (divisionId: string) => {
    onChange({
      divisionId: divisionId || null,
      districtId: null,
    });
    onConstituencySelect?.(null);
  };

  const handleDistrictChange = (districtId: string) => {
    onChange({
      ...value,
      districtId: districtId || null,
    });
    onConstituencySelect?.(null);
  };

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

  return (
    <div className='space-y-3'>
      {/* Division Select */}
      <SelectWrapper>
        <select
          value={value.divisionId || ''}
          onChange={(e) => handleDivisionChange(e.target.value)}
          className={SIDEBAR_STYLES.select}
        >
          <option value=''>{SIDEBAR_TEXT.filters.allDivisions}</option>
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>
              {div.bn_name || div.name}
            </option>
          ))}
        </select>
      </SelectWrapper>

      {/* District Select */}
      {value.divisionId && (
        <SelectWrapper>
          <select
            value={value.districtId || ''}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className={SIDEBAR_STYLES.select}
          >
            <option value=''>{SIDEBAR_TEXT.filters.allDistricts}</option>
            {filteredDistricts.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {dist.bn_name || dist.name}
              </option>
            ))}
          </select>
        </SelectWrapper>
      )}

      {/* Constituency Select */}
      {value.districtId && filteredConstituencies.length > 0 && (
        <SelectWrapper>
          <select
            value={selectedConstituency?.id || ''}
            onChange={(e) => handleConstituencyChange(e.target.value)}
            className={SIDEBAR_STYLES.select}
          >
            <option value=''>{SIDEBAR_TEXT.filters.selectConstituency}</option>
            {filteredConstituencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.name_english}
              </option>
            ))}
          </select>
        </SelectWrapper>
      )}
    </div>
  );
}

export default memo(FilterPanel);
