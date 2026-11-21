import { startOfMonth } from 'date-fns';
import { cache } from 'react';

import type { AiTier } from '@/features/ai';
import {
  FREE_MONTHLY_LIMIT,
  getMonthlyReviewLimit,
  PRO_MONTHLY_LIMIT,
} from '@/features/billing/constants';
import { getUserSubscription } from '@/features/billing/server/subscription';
import {
  getUserIdByInstallationId,
  getUserInstallationId,
} from '@/features/github/server/installation';
import { prisma } from '@/lib/db.config';

export { FREE_MONTHLY_LIMIT, PRO_MONTHLY_LIMIT };

export type UsageSummary = {
  used: number;
  /** Reviews included this month: 1 on Free, 10 on Pro. */
  limit: number;
};

/**
 * Counts reviews consumed this month by an installation: finished reviews plus
 * reviews still in flight, so a burst of PRs cannot slip past the limit.
 */
export async function countReviewsThisMonth(
  installationId: number,
  excludePullRequestId?: string,
): Promise<number> {
  const monthStart = startOfMonth(new Date());

  return prisma.pullRequest.count({
    where: {
      installationId,
      ...(excludePullRequestId ? { id: { not: excludePullRequestId } } : {}),
      OR: [
        { status: 'reviewed', reviewedAt: { gte: monthStart } },
        { status: { in: ['pending', 'processing'] }, updatedAt: { gte: monthStart } },
      ],
    },
  });
}

async function isProUser(userId: string | null): Promise<boolean> {
  if (!userId) return false;
  const subscription = await getUserSubscription(userId);
  return subscription.plan === 'pro' && subscription.status === 'active';
}

/** The plan an installation's reviews are billed against (decides the monthly limit). */
export async function getInstallationTier(installationId: number): Promise<AiTier> {
  const userId = await getUserIdByInstallationId(installationId);
  return (await isProUser(userId)) ? 'pro' : 'free';
}

export type ReviewAllowance = {
  allowed: boolean;
  tier: AiTier;
  limit: number;
};

/** Whether a new review may start for this installation right now, and why not. */
export async function canInstallationReview(
  installationId: number,
  excludePullRequestId?: string,
): Promise<ReviewAllowance> {
  const [tier, used] = await Promise.all([
    getInstallationTier(installationId),
    countReviewsThisMonth(installationId, excludePullRequestId),
  ]);
  const limit = getMonthlyReviewLimit(tier);
  return { allowed: used < limit, tier, limit };
}

/** Memoized per request: the sidebar and the current page share one count. */
export const getUsageSummary = cache(async function getUsageSummary(
  userId: string,
): Promise<UsageSummary> {
  const [installationId, pro] = await Promise.all([
    getUserInstallationId(userId),
    isProUser(userId),
  ]);
  const used = installationId ? await countReviewsThisMonth(installationId) : 0;

  return { used, limit: getMonthlyReviewLimit(pro ? 'pro' : 'free') };
});
