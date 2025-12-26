'use client';

import { useEffect, useState } from 'react';

interface DevelopmentData {
  constituency_id: string;
  name_english: string;
  name: string;
  district: string;
  division: string;
  lat: number;
  lng: number;
  registered_voters: number | null;
  urban_classification: 'urban' | 'rural';
  overall_score: number;
  scores: {
    education: number;
    healthcare: number;
    finance: number;
    commerce: number;
    transport: number;
  };
  categories: {
    education: { count: number; icon: string };
    healthcare: { count: number; icon: string };
    finance: { count: number; icon: string };
    commerce: { count: number; icon: string };
    transport: { count: number; icon: string };
  };
}

interface DevelopmentScoresData {
  national_average: {
    overall: number;
    education: number;
    healthcare: number;
    finance: number;
    commerce: number;
    transport: number;
  };
  division_averages: Record<string, {
    overall: number;
    education: number;
    healthcare: number;
    finance: number;
    commerce: number;
    transport: number;
  }>;
  constituencies: DevelopmentData[];
}

interface DevelopmentScoreProps {
  constituencyId: string;
  onClose: () => void;
}

const CATEGORY_CONFIG = {
  education: {
    label: 'Education',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    description: 'Schools, Universities, Libraries',
  },
  healthcare: {
    label: 'Healthcare',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    description: 'Hospitals, Clinics, Pharmacies',
  },
  finance: {
    label: 'Finance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    description: 'Banks, ATMs',
  },
  commerce: {
    label: 'Commerce',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    description: 'Markets, Malls, Stores',
  },
  transport: {
    label: 'Transport',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    description: 'Bus & Train Stations',
  },
};

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export default function DevelopmentScore({ constituencyId, onClose }: DevelopmentScoreProps) {
  const [data, setData] = useState<DevelopmentData | null>(null);
  const [allData, setAllData] = useState<DevelopmentScoresData | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareWith, setCompareWith] = useState<'national' | 'division'>('national');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/development-scores.json');
        const json: DevelopmentScoresData = await response.json();
        setAllData(json);

        const constituency = json.constituencies.find(
          c => c.constituency_id === constituencyId
        );
        setData(constituency || null);
      } catch (error) {
        console.error('Failed to load development data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [constituencyId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-slate-900 rounded-2xl p-8 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="mt-4 text-slate-400">Loading development data...</p>
        </div>
      </div>
    );
  }

  if (!data || !allData) {
    return (
      <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-slate-900 rounded-2xl p-8 text-center">
          <p className="text-slate-400">No development data available</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const comparisonData = compareWith === 'national'
    ? allData.national_average
    : allData.division_averages[data.division];

  const getScoreDiff = (score: number, avgScore: number) => {
    const diff = score - avgScore;
    if (diff > 5) return { text: `+${diff}`, color: 'text-emerald-400' };
    if (diff < -5) return { text: `${diff}`, color: 'text-red-400' };
    return { text: `${diff > 0 ? '+' : ''}${diff}`, color: 'text-slate-400' };
  };

  const overallDiff = getScoreDiff(data.overall_score, comparisonData.overall);

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{data.name_english}</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {data.district} · {data.division} Division
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Score */}
          <div className="flex items-center gap-6">
            {/* Score Circle */}
            <div className="relative">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke={data.overall_score >= 60 ? '#10b981' : data.overall_score >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.overall_score / 100) * 301.59} 301.59`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{data.overall_score}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Development Score</h3>
              <p className="text-sm text-slate-400 mb-3">
                Based on infrastructure density per 100,000 voters
              </p>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  data.urban_classification === 'urban'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {data.urban_classification === 'urban' ? 'Urban' : 'Rural'}
                </span>
                <span className={`text-sm font-medium ${overallDiff.color}`}>
                  {overallDiff.text} vs {compareWith === 'national' ? 'national' : 'division'} avg
                </span>
              </div>
            </div>
          </div>

          {/* Comparison Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setCompareWith('national')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                compareWith === 'national'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              vs National Average
            </button>
            <button
              onClick={() => setCompareWith('division')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                compareWith === 'division'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              vs {data.division} Division
            </button>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
            <RadarChart
              scores={data.scores}
              comparisonScores={comparisonData}
              compareWith={compareWith}
            />
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Category Breakdown
            </h3>
            {(Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map((category) => {
              const config = CATEGORY_CONFIG[category];
              const score = data.scores[category];
              const count = data.categories[category]?.count || 0;
              const avgScore = comparisonData[category];
              const diff = getScoreDiff(score, avgScore);

              return (
                <div
                  key={category}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.bgColor, color: config.color }}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{config.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">{score}</span>
                          <span className={`text-xs font-medium ${diff.color}`}>
                            {diff.text}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{config.description}</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        backgroundColor: config.color,
                      }}
                    />
                    {/* Average marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                      style={{ left: `${avgScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-600">{count} facilities</span>
                    <span className="text-xs text-slate-600">Avg: {avgScore}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Source */}
          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-xs text-slate-600">
              Data source: Google Maps Places API · Mock data for demo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Radar Chart Component
function RadarChart({
  scores,
  comparisonScores,
  compareWith,
}: {
  scores: Record<string, number>;
  comparisonScores: Record<string, number>;
  compareWith: 'national' | 'division';
}) {
  const categories = Object.keys(CATEGORY_CONFIG) as CategoryKey[];
  const center = 100;
  const radius = 80;

  const getPoint = (index: number, value: number) => {
    const angle = (index / categories.length) * 2 * Math.PI - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const createPath = (values: Record<string, number>) => {
    return categories
      .map((cat, i) => {
        const point = getPoint(i, values[cat]);
        return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
      })
      .join(' ') + ' Z';
  };

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-64 h-64">
        {/* Grid circles */}
        {[20, 40, 60, 80, 100].map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {categories.map((_, i) => {
          const point = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Comparison area */}
        <path
          d={createPath(comparisonScores)}
          fill="rgba(148, 163, 184, 0.2)"
          stroke="rgba(148, 163, 184, 0.5)"
          strokeWidth="1"
        />

        {/* Score area */}
        <path
          d={createPath(scores)}
          fill="rgba(34, 211, 238, 0.3)"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Points */}
        {categories.map((cat, i) => {
          const point = getPoint(i, scores[cat]);
          return (
            <circle
              key={cat}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#22d3ee"
              stroke="#0e7490"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {categories.map((cat, i) => {
          const point = getPoint(i, 120);
          const config = CATEGORY_CONFIG[cat];
          return (
            <text
              key={cat}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={config.color}
              fontSize="10"
              fontWeight="500"
            >
              {config.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="ml-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-xs text-slate-400">This Constituency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400/50" />
          <span className="text-xs text-slate-400">
            {compareWith === 'national' ? 'National' : 'Division'} Avg
          </span>
        </div>
      </div>
    </div>
  );
}
