'use client';

import { useState, useEffect, useRef } from 'react';
import type { ConstituencyInfo } from './ConstituencyLayer';

interface SearchBarProps {
  onSelect: (constituency: ConstituencyInfo) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ConstituencyInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [constituencies, setConstituencies] = useState<ConstituencyInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load constituencies
  useEffect(() => {
    fetch('/data/constituency-population.json')
      .then(res => res.json())
      .then(data => setConstituencies(data.constituencies || []))
      .catch(err => console.error('Error loading constituencies:', err));
  }, []);

  // Filter and rank results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();

    // Simple fuzzy match: check if characters appear in order
    const fuzzyMatch = (text: string | undefined, term: string): boolean => {
      if (!text) return false;
      const lowerText = text.toLowerCase();
      // Direct include check first
      if (lowerText.includes(term)) return true;
      // Fuzzy: characters in order with gaps allowed
      let termIndex = 0;
      for (const char of lowerText) {
        if (char === term[termIndex]) {
          termIndex++;
          if (termIndex === term.length) return true;
        }
      }
      return false;
    };

    // Calculate relevance score (higher = better match)
    const getScore = (c: ConstituencyInfo): number => {
      let score = 0;
      const nameEng = c.name_english?.toLowerCase() || '';
      const name = c.name?.toLowerCase() || '';
      const districtEng = c.district_english?.toLowerCase() || '';
      const district = c.district?.toLowerCase() || '';
      const divisionEng = c.division_english?.toLowerCase() || '';

      // Exact match on constituency name (highest priority)
      if (nameEng === searchTerm || name === searchTerm) score += 1000;
      // Starts with on constituency name
      else if (nameEng.startsWith(searchTerm) || name.startsWith(searchTerm)) score += 500;
      // Contains in constituency name
      else if (nameEng.includes(searchTerm) || name.includes(searchTerm)) score += 300;

      // Exact match on district
      if (districtEng === searchTerm || district === searchTerm) score += 200;
      // Starts with on district
      else if (districtEng.startsWith(searchTerm) || district.startsWith(searchTerm)) score += 150;
      // Contains in district
      else if (districtEng.includes(searchTerm) || district.includes(searchTerm)) score += 100;

      // Division matches (lowest priority)
      if (divisionEng.startsWith(searchTerm)) score += 50;
      else if (divisionEng.includes(searchTerm)) score += 25;

      // Fuzzy match bonus (smaller)
      if (score === 0) {
        if (fuzzyMatch(c.name_english, searchTerm) || fuzzyMatch(c.name, searchTerm)) score += 20;
        else if (fuzzyMatch(c.district_english, searchTerm) || fuzzyMatch(c.district, searchTerm)) score += 10;
      }

      return score;
    };

    // Filter and sort by score
    const scored = constituencies
      .map(c => ({ constituency: c, score: getScore(c) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.constituency);

    setResults(scored);
    setIsOpen(scored.length > 0);
  }, [query, constituencies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
    <div ref={containerRef} className="absolute top-14 left-4 z-[1000]" style={{ width: '280px' }}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search constituency..."
          className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/95 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 backdrop-blur-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="w-4 h-4 text-neutral-500 hover:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900/95 border border-neutral-800 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden">
          {results.map((constituency) => (
            <button
              key={constituency.id}
              onClick={() => handleSelect(constituency)}
              className="w-full px-4 py-3 text-left hover:bg-neutral-800/50 transition-colors border-b border-neutral-800/50 last:border-0"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-white">
                  {constituency.name_english}
                </span>
                {constituency.name && (
                  <span className="text-xs text-teal-400/80">
                    {constituency.name}
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {constituency.district_english}
                {constituency.district && ` (${constituency.district})`}
                , {constituency.division_english}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
