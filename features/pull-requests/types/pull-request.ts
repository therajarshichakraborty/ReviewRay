/**
 * Type definitions for pull request list and detail views.
 * Dates are ISO strings so the objects can cross the server/client boundary.
 */

/** Lifecycle of an AI review, mirroring the `pull_request.status` column. */
export const PULL_REQUEST_STATUSES = [
  'pending',
  'processing',
  'reviewed',
  'rate_limited',
  'failed',
  'skipped',
] as const;

export type PullRequestStatus = (typeof PULL_REQUEST_STATUSES)[number];

export function toPullRequestStatus(value: string): PullRequestStatus {
  return (PULL_REQUEST_STATUSES as readonly string[]).includes(value)
    ? (value as PullRequestStatus)
    : 'pending';
}

export type PullRequestItem = {
  id: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  baseBranch: string;
  status: PullRequestStatus;
  reviewedAt: string | null;
  createdAt: string;
};

export type RepoPullRequests = {
  repoFullName: string;
  pullRequests: PullRequestItem[];
};
