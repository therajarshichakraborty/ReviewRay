import type {
  OverviewActivityItem,
  OverviewStatusBreakdown,
} from '@/features/overview/types/overview';
import { toPullRequestStatus } from '@/features/pull-requests/types/pull-request';
import { prisma } from '@/lib/db.config';

const EMPTY_BREAKDOWN: OverviewStatusBreakdown = {
  reviewed: 0,
  inFlight: 0,
  rateLimited: 0,
  failed: 0,
  skipped: 0,
  total: 0,
};

export async function getRecentReviewActivity(
  installationId: number,
): Promise<OverviewActivityItem[]> {
  const pullRequests = await prisma.pullRequest.findMany({
    where: { installationId },
    orderBy: { updatedAt: 'desc' },
    take: 6,
    select: {
      id: true,
      repoFullName: true,
      prNumber: true,
      title: true,
      status: true,
      updatedAt: true,
    },
  });

  return pullRequests.map((pullRequest) => ({
    id: pullRequest.id,
    repoFullName: pullRequest.repoFullName,
    prNumber: pullRequest.prNumber,
    title: pullRequest.title,
    status: toPullRequestStatus(pullRequest.status),
    updatedAt: pullRequest.updatedAt.toISOString(),
  }));
}

export async function getStatusBreakdown(installationId: number): Promise<OverviewStatusBreakdown> {
  const groups = await prisma.pullRequest.groupBy({
    by: ['status'],
    where: { installationId },
    _count: { _all: true },
  });

  const breakdown = { ...EMPTY_BREAKDOWN };

  for (const group of groups) {
    const count = group._count._all;
    breakdown.total += count;

    switch (toPullRequestStatus(group.status)) {
      case 'reviewed':
        breakdown.reviewed += count;
        break;
      case 'pending':
      case 'processing':
        breakdown.inFlight += count;
        break;
      case 'rate_limited':
        breakdown.rateLimited += count;
        break;
      case 'failed':
        breakdown.failed += count;
        break;
      case 'skipped':
        breakdown.skipped += count;
        break;
    }
  }

  return breakdown;
}

export { EMPTY_BREAKDOWN };
