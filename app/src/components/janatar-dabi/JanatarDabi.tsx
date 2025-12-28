'use client';

import { useState, useMemo } from 'react';
import { useJanatarDabi } from './useJanatarDabi';
import { ISSUES, ISSUE_KEYS, type IssueType } from '@/types/janatar-dabi';

interface JanatarDabiProps {
  constituencyId: string;
  constituencyName: string;
  constituencyNameBn?: string;
}

export function JanatarDabi({
  constituencyId,
  constituencyName,
  constituencyNameBn,
}: JanatarDabiProps) {
  const {
    votes,
    hasVoted,
    votedIssue,
    loading,
    submitting,
    error,
    submitVote,
  } = useJanatarDabi(constituencyId);

  const [showAnimation, setShowAnimation] = useState(false);

  // Calculate percentages and sort issues
  const sortedIssues = useMemo(() => {
    if (!votes) return [];

    const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

    return ISSUE_KEYS.map((key) => ({
      key,
      config: ISSUES[key],
      count: votes[key],
      percentage: totalVotes > 0 ? Math.round((votes[key] / totalVotes) * 100) : 0,
    })).sort((a, b) => b.count - a.count);
  }, [votes]);

  const topIssue = sortedIssues[0];
  const totalVotes = votes
    ? Object.values(votes).reduce((sum, v) => sum + v, 0)
    : 0;

  const handleVote = async (issue: IssueType) => {
    if (hasVoted || submitting) return;

    const success = await submitVote(issue);
    if (success) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-teal-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
            <span className="text-xl">📢</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">জনতার দাবি</h3>
            <p className="text-sm text-neutral-400">People&apos;s Demands</p>
          </div>
        </div>
      </div>

      {/* Vote Animation Overlay */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 animate-fade-in">
          <div className="text-center">
            <div className="text-5xl mb-2 animate-bounce">✅</div>
            <p className="text-xl font-semibold text-teal-400">
              ভোট রেকর্ড হয়েছে!
            </p>
            <p className="text-sm text-neutral-400">Vote Recorded</p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6 relative">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Vote Section - Only show if not voted */}
        {!hasVoted && (
          <div>
            <p className="text-white font-medium mb-1 text-bangla-lg">
              এই এলাকার সবচেয়ে বড় সমস্যা কী?
            </p>
            <p className="text-neutral-500 text-base mb-4">
              What is the biggest problem in {constituencyName}?
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ISSUE_KEYS.map((issueKey) => {
                const issue = ISSUES[issueKey];
                return (
                  <button
                    key={issueKey}
                    onClick={() => handleVote(issueKey)}
                    disabled={submitting}
                    className={`
                      relative p-4 rounded-xl border transition-all duration-200
                      ${
                        submitting
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-105 hover:border-rose-500/50 hover:bg-rose-500/10 active:scale-95'
                      }
                      bg-white/[0.03] border-white/10
                      group
                    `}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{issue.icon}</div>
                    <div className="text-base font-medium text-white text-bangla">
                      {issue.label}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {issue.labelEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Section */}
        {(hasVoted || totalVotes > 0) && (
          <div>
            {hasVoted && (
              <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <p className="text-teal-400 text-base flex items-center gap-2 text-bangla">
                  <span>✓</span>
                  <span>
                    আপনি ভোট দিয়েছেন:{' '}
                    <strong>{votedIssue ? ISSUES[votedIssue].label : ''}</strong>
                  </span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                ফলাফল • Results
              </h4>
              <span className="text-sm text-neutral-500 text-bangla">
                মোট ভোট: {totalVotes}
              </span>
            </div>

            {/* Bar Chart */}
            <div className="space-y-3">
              {sortedIssues.map(({ key, config, count, percentage }) => (
                <div key={key} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{config.icon}</span>
                      <span className="text-base text-white text-bangla">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">
                        ({count})
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: config.color }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Insight Text */}
            {topIssue && topIssue.count > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{topIssue.config.icon}</span>
                  <div>
                    <p className="text-white text-bangla-lg">
                      <strong className="text-rose-400">
                        {topIssue.percentage}%
                      </strong>{' '}
                      মানুষ চান পরবর্তী এমপি{' '}
                      <strong>{topIssue.config.label}</strong> সমস্যা সমাধান করুক
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {topIssue.percentage}% of people want the next MP to
                      address {topIssue.config.labelEn}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasVoted && totalVotes === 0 && (
          <p className="text-center text-neutral-500 text-sm py-4">
            এখনো কোনো ভোট পড়েনি • Be the first to vote!
          </p>
        )}
      </div>
    </div>
  );
}
