import { startOfMonth } from 'date-fns';

import type { AiTier } from '@/features/ai';
import { FREE_MONTHLY_LIMIT } from '@/features/billing/constants';
import { getUserSubscription } from '@/features/billing/server/subscription';
import {
  getUserIdByInstallationId,
  getUserInstallationId,
} from '@/features/github/server/installation';
import { prisma } from '@/lib/db.config';

export { FREE_MONTHLY_LIMIT };

export type UsageSummary = {
  used: number;
  limit: number | null;
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

/** The AI tier an installation's reviews run on (decides OpenRouter vs OpenAI). */
export async function getInstallationTier(installationId: number): Promise<AiTier> {
  const userId = await getUserIdByInstallationId(installationId);
  return (await isProUser(userId)) ? 'pro' : 'free';
}

/** Whether a new review may start for this installation right now. */
export async function canInstallationReview(
  installationId: number,
  excludePullRequestId?: string,
): Promise<boolean> {
  if ((await getInstallationTier(installationId)) === 'pro') return true;
  const used = await countReviewsThisMonth(installationId, excludePullRequestId);
  return used < FREE_MONTHLY_LIMIT;
}

export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const [installationId, pro] = await Promise.all([
    getUserInstallationId(userId),
    isProUser(userId),
  ]);
  const used = installationId ? await countReviewsThisMonth(installationId) : 0;

  return { used, limit: pro ? null : FREE_MONTHLY_LIMIT };
}
