'use client';

import { useState, useEffect, useCallback } from 'react';
import { ISSUE_KEYS, type IssueType, type IssueVotes } from '@/types/janatar-dabi';

const STORAGE_KEY_PREFIX = 'janatar_dabi_voted_';

interface UseJanatarDabiReturn {
  votes: IssueVotes | null;
  hasVoted: boolean;
  votedIssue: IssueType | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  submitVote: (issue: IssueType, turnstileToken: string) => Promise<boolean>;
}

function isValidIssueType(value: string): value is IssueType {
  return ISSUE_KEYS.includes(value as IssueType);
}

export function useJanatarDabi(constituencyId: string): UseJanatarDabiReturn {
  const [votes, setVotes] = useState<IssueVotes | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedIssue, setVotedIssue] = useState<IssueType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}${constituencyId}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVote = localStorage.getItem(storageKey);
      if (storedVote && isValidIssueType(storedVote)) {
        setHasVoted(true);
        setVotedIssue(storedVote);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchVotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/janatar-dabi?constituency_id=${constituencyId}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (isMounted) {
          if (data.success) {
            setVotes(data.votes);
          } else {
            setError(data.error || 'Failed to fetch votes');
          }
        }
      } catch {
        if (isMounted) {
          setError('Failed to connect to server');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVotes();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [constituencyId]);

  const submitVote = useCallback(
    async (issue: IssueType, turnstileToken: string): Promise<boolean> => {
      if (hasVoted) {
        setError('You have already voted for this constituency');
        return false;
      }

      if (!turnstileToken) {
        setError('Please complete the CAPTCHA verification');
        return false;
      }

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch('/api/janatar-dabi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ constituency_id: constituencyId, issue, turnstile_token: turnstileToken }),
        });

        const data = await response.json();

        if (data.success) {
          setVotes(data.votes);
          setHasVoted(true);
          setVotedIssue(issue);

          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, issue);
          }
          return true;
        } else {
          setError(data.error || 'Failed to submit vote');
          return false;
        }
      } catch {
        setError('Failed to connect to server');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [constituencyId, hasVoted, storageKey]
  );

  return { votes, hasVoted, votedIssue, loading, submitting, error, submitVote };
}
