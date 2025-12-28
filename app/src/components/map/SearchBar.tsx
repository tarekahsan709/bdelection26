'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { ConstituencyInfo } from './ConstituencyLayer';

interface SearchBarProps {
  onSelect: (constituency: ConstituencyInfo) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [constituencies, setConstituencies] = useState<ConstituencyInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/constituency-voters-2025.json', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setConstituencies(data.constituencies || []))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();

    const fuzzyMatch = (text: string | undefined, term: string): boolean => {
      if (!text) return false;
      const lowerText = text.toLowerCase();
      if (lowerText.includes(term)) return true;
      let termIndex = 0;
      for (const char of lowerText) {
        if (char === term[termIndex]) {
          termIndex++;
          if (termIndex === term.length) return true;
        }
      }
      return false;
    };

    const getScore = (c: ConstituencyInfo): number => {
      let score = 0;
      const nameEng = c.name_english?.toLowerCase() || '';
      const name = c.name?.toLowerCase() || '';
      const districtEng = c.district_english?.toLowerCase() || '';
      const district = c.district?.toLowerCase() || '';
      const divisionEng = c.division_english?.toLowerCase() || '';

      if (nameEng === searchTerm || name === searchTerm) score += 1000;
      else if (nameEng.startsWith(searchTerm) || name.startsWith(searchTerm))
        score += 500;
      else if (nameEng.includes(searchTerm) || name.includes(searchTerm))
        score += 300;

      if (districtEng === searchTerm || district === searchTerm) score += 200;
      else if (
        districtEng.startsWith(searchTerm) ||
        district.startsWith(searchTerm)
      )
        score += 150;
      else if (
        districtEng.includes(searchTerm) ||
        district.includes(searchTerm)
      )
        score += 100;

      if (divisionEng.startsWith(searchTerm)) score += 50;
      else if (divisionEng.includes(searchTerm)) score += 25;

      if (score === 0) {
        if (
          fuzzyMatch(c.name_english, searchTerm) ||
          fuzzyMatch(c.name, searchTerm)
        )
          score += 20;
        else if (
          fuzzyMatch(c.district_english, searchTerm) ||
          fuzzyMatch(c.district, searchTerm)
        )
          score += 10;
      }

      return score;
    };

    return constituencies
      .map((c) => ({ constituency: c, score: getScore(c) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.constituency);
  }, [query, constituencies]);

  useEffect(() => {
    setIsOpen(results.length > 0 && query.trim().length > 0);
  }, [results, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (constituency: ConstituencyInfo) => {
    onSelect(constituency);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className='absolute top-16 md:top-14 left-3 right-3 md:right-auto md:left-4 z-1000 md:w-72'
    >
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='w-5 h-5 text-neutral-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='নির্বাচনী এলাকা খুঁজুন...'
          className='w-full h-11 pl-11 pr-11 bg-neutral-900/95 border border-neutral-800 rounded-xl text-base text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500/50 backdrop-blur-sm'
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className='absolute inset-y-0 right-0 w-11 flex items-center justify-center'
            aria-label='Clear search'
          >
            <svg
              className='w-5 h-5 text-neutral-500 active:text-neutral-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-neutral-900/95 border border-neutral-800 rounded-xl shadow-xl backdrop-blur-sm overflow-hidden max-h-64 overflow-y-auto'>
          {results.map((constituency) => (
            <button
              key={constituency.id}
              onClick={() => handleSelect(constituency)}
              className='w-full min-h-11 px-4 py-3 text-left active:bg-neutral-800/50 border-b border-neutral-800/50 last:border-0'
            >
              <div className='flex items-baseline gap-2'>
                <span className='text-base font-medium text-white'>
                  {constituency.name_english}
                </span>
                {constituency.name && (
                  <span className='text-sm text-teal-400/80'>
                    {constituency.name}
                  </span>
                )}
              </div>
              <div className='text-sm text-neutral-500 mt-0.5'>
                {constituency.district_english}, {constituency.division_english}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
