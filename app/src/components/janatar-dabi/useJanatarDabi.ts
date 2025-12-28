'use client';

import { useState, useEffect, useCallback } from 'react';
import type { IssueType, IssueVotes } from '@/types/janatar-dabi';

const STORAGE_KEY_PREFIX = 'janatar_dabi_voted_';

interface UseJanatarDabiReturn {
  votes: IssueVotes | null;
  hasVoted: boolean;
  votedIssue: IssueType | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  submitVote: (issue: IssueType) => Promise<boolean>;
}

export function useJanatarDabi(constituencyId: string): UseJanatarDabiReturn {
  const [votes, setVotes] = useState<IssueVotes | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedIssue, setVotedIssue] = useState<IssueType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}${constituencyId}`;

  // Check localStorage for previous vote
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVote = localStorage.getItem(storageKey);
      if (storedVote) {
        setHasVoted(true);
        setVotedIssue(storedVote as IssueType);
      }
    }
  }, [storageKey]);

  // Fetch current votes
  useEffect(() => {
    const fetchVotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/janatar-dabi?constituency_id=${constituencyId}`
        );
        const data = await response.json();

        if (data.success) {
          setVotes(data.votes);
        } else {
          setError(data.error || 'Failed to fetch votes');
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching votes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [constituencyId]);

  const submitVote = useCallback(
    async (issue: IssueType): Promise<boolean> => {
      if (hasVoted) {
        setError('You have already voted for this constituency');
        return false;
      }

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch('/api/janatar-dabi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            constituency_id: constituencyId,
            issue,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setVotes(data.votes);
          setHasVoted(true);
          setVotedIssue(issue);

          // Store in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, issue);
          }

          return true;
        } else {
          setError(data.error || 'Failed to submit vote');
          return false;
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error submitting vote:', err);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [constituencyId, hasVoted, storageKey]
  );

  return {
    votes,
    hasVoted,
    votedIssue,
    loading,
    submitting,
    error,
    submitVote,
  };
}
