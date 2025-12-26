'use client';

import { useState, useEffect } from 'react';
import type { FilterState } from '@/types/map';
import type { ConstituencyInfo } from '@/components/map/ConstituencyLayer';

interface Division {
  id: string;
  name: string;
  bn_name: string;
}

interface District {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
}

interface FilterPanelProps {
  value: FilterState;
  onChange: (filters: FilterState) => void;
  onConstituencySelect?: (constituency: ConstituencyInfo | null) => void;
  selectedConstituency?: ConstituencyInfo | null;
}

export default function FilterPanel({
  value,
  onChange,
  onConstituencySelect,
  selectedConstituency,
}: FilterPanelProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<ConstituencyInfo[]>([]);
  const [allConstituencies, setAllConstituencies] = useState<ConstituencyInfo[]>([]);

  useEffect(() => {
    fetch('/data/bd-divisions.json')
      .then((res) => res.json())
      .then((data) => setDivisions(data.divisions || []))
      .catch((err) => console.error('Error loading divisions:', err));
  }, []);

  useEffect(() => {
    fetch('/data/constituency-population.json')
      .then((res) => res.json())
      .then((data) => setAllConstituencies(data.constituencies || []))
      .catch((err) => console.error('Error loading constituencies:', err));
  }, []);

  useEffect(() => {
    if (!value.divisionId) {
      setDistricts([]);
      return;
    }

    fetch('/data/bd-districts.json')
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.districts || []).filter(
          (d: District) => d.division_id === value.divisionId
        );
        setDistricts(filtered);
      })
      .catch((err) => console.error('Error loading districts:', err));
  }, [value.divisionId]);

  useEffect(() => {
    if (!value.districtId) {
      setConstituencies([]);
      return;
    }

    const filtered = allConstituencies.filter(
      (c) => c.district_id === value.districtId
    );
    setConstituencies(filtered);
  }, [value.districtId, allConstituencies]);

  const handleConstituencyChange = (constituencyId: string) => {
    if (!constituencyId || !onConstituencySelect) {
      onConstituencySelect?.(null);
      return;
    }

    const constituency = allConstituencies.find((c) => c.id === constituencyId);
    if (constituency) {
      onConstituencySelect(constituency);
    }
  };

  const selectClass = `
    w-full px-3 py-2.5 rounded-lg text-sm
    bg-white/5 border border-white/10
    text-white placeholder-slate-500
    focus:outline-none focus:border-teal-500/30 focus:ring-1 focus:ring-teal-500/20
    hover:bg-white/10
    transition-all duration-200
    appearance-none cursor-pointer
  `;

  return (
    <div className="space-y-3">
      {/* Division */}
      <div className="relative">
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
          <option value="">সব বিভাগ</option>
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>
              {div.bn_name || div.name}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      {/* District */}
      {value.divisionId && (
        <div className="relative">
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
            <option value="">সব জেলা</option>
            {districts.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {dist.bn_name || dist.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      )}

      {/* Constituency */}
      {value.districtId && constituencies.length > 0 && (
        <div className="relative">
          <select
            value={selectedConstituency?.id || ''}
            onChange={(e) => handleConstituencyChange(e.target.value)}
            className={selectClass}
          >
            <option value="">নির্বাচনী এলাকা বাছুন</option>
            {constituencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_english}
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
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
