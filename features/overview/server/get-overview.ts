/**
 * Aggregates the database-backed data the dashboard Overview page needs in one
 * call. Independent queries run in parallel. The GitHub repository summary is
 * fetched separately (see `getOverviewRepoSummary`) so it can stream in
 * without holding back the rest of the page.
 */

import { getUsageSummary } from '@/features/billing/server/usage';
import { getUserSubscription } from '@/features/billing/server/subscription';
import {
  getInstallationStatus,
  getUserInstallationId,
} from '@/features/github/server/installation';
import type { OverviewData, OverviewRepoSummary } from '@/features/overview/types/overview';
import { prisma } from '@/lib/db.config';

import { EMPTY_BREAKDOWN, getRecentReviewActivity, getStatusBreakdown } from './activity';
import { getInstallationRepoSummary } from './repo-summary';

export async function getOverviewRepoSummary(installationId: number): Promise<OverviewRepoSummary | null> {
  try {
    return await getInstallationRepoSummary(installationId);
  } catch (error) {
    // GitHub being slow or down should not take the whole dashboard with it.
    console.warn('[overview] repo summary unavailable:', error);
    return null;
  }
}

export async function getOverview(userId: string): Promise<OverviewData> {
  const [installation, installationId, subscription, usage] = await Promise.all([
    getInstallationStatus(userId),
    getUserInstallationId(userId),
    getUserSubscription(userId),
    getUsageSummary(userId),
  ]);

  const base = {
    installation,
    reviewsUsed: usage.used,
    reviewsLimit: usage.limit,
    plan: subscription.plan,
    installationId,
  };

  if (!installationId) {
    return {
      ...base,
      syncedRepoCount: 0,
      breakdown: EMPTY_BREAKDOWN,
      recentActivity: [],
    };
  }

  const [breakdown, recentActivity, syncedRepoCount] = await Promise.all([
    getStatusBreakdown(installationId),
    getRecentReviewActivity(installationId),
    prisma.repoSync.count({ where: { installationId, status: 'synced' } }),
  ]);

  return { ...base, syncedRepoCount, breakdown, recentActivity };
}
