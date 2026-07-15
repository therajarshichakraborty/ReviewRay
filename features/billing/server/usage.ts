import { startOfMonth } from 'date-fns';

import { getUserInstallationId } from '@/features/github/server/installation';
import { getUserSubscription } from '@/features/billing/server/subscription';
import { prisma } from '@/lib/db.config';

export const FREE_MONTHLY_LIMIT = 5;

export type UsageSummary = {
  used: number;
  limit: number | null;
};

export async function getReviewsThisMonth(userId: string): Promise<number> {
  const installationId = await getUserInstallationId(userId);

  if (!installationId) {
    return 0;
  }

  return prisma.pullRequest.count({
    where: {
      installationId,
      status: 'reviewed',
      reviewedAt: { gte: startOfMonth(new Date()) },
    },
  });
}

export async function canUserReview(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (subscription.plan === 'pro' && subscription.status === 'active') {
    return true;
  }

  const used = await getReviewsThisMonth(userId);
  return used < FREE_MONTHLY_LIMIT;
}

export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const subscription = await getUserSubscription(userId);
  const used = await getReviewsThisMonth(userId);

  if (subscription.plan === 'pro' && subscription.status === 'active') {
    return { used, limit: null };
  }

  return { used, limit: FREE_MONTHLY_LIMIT };
}
