import type { GithubInstallationStatus, SubscriptionPlan } from '@/features/dashboard/lib/types';
import type { PullRequestStatus } from '@/features/pull-requests/types/pull-request';

export type OverviewRepoSummary = {
  totalCount: number;
  publicCount: number;
  privateCount: number;
  hasMorePages: boolean;
};

export type OverviewActivityItem = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  status: PullRequestStatus;
  updatedAt: string;
};

/** How every tracked pull request is distributed across review outcomes. */
export type OverviewStatusBreakdown = {
  reviewed: number;
  inFlight: number;
  rateLimited: number;
  failed: number;
  skipped: number;
  total: number;
};

export type OverviewData = {
  installation: GithubInstallationStatus;
  repos: OverviewRepoSummary | null;
  syncedRepoCount: number;
  reviewsUsed: number;
  reviewsLimit: number | null;
  plan: SubscriptionPlan;
  breakdown: OverviewStatusBreakdown;
  recentActivity: OverviewActivityItem[];
};
