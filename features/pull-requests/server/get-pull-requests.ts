import type {
  PullRequestItem,
  RepoPullRequests,
} from '@/features/pull-requests/types/pull-request';
import { toPullRequestStatus } from '@/features/pull-requests/types/pull-request';
import { prisma } from '@/lib/db.config';

const MAX_PULL_REQUESTS = 200;

/** All pull requests for an installation, grouped by repository, newest activity first. */
export async function getPullRequestsByRepo(installationId: number): Promise<RepoPullRequests[]> {
  const records = await prisma.pullRequest.findMany({
    where: { installationId },
    orderBy: { updatedAt: 'desc' },
    take: MAX_PULL_REQUESTS,
    select: {
      id: true,
      repoFullName: true,
      prNumber: true,
      title: true,
      authorLogin: true,
      baseBranch: true,
      status: true,
      reviewComment: true,
      reviewedAt: true,
      createdAt: true,
    },
  });

  const groups = new Map<string, PullRequestItem[]>();

  for (const record of records) {
    const item: PullRequestItem = {
      id: record.id,
      prNumber: record.prNumber,
      title: record.title,
      authorLogin: record.authorLogin,
      baseBranch: record.baseBranch,
      status: toPullRequestStatus(record.status),
      reviewComment: record.reviewComment,
      reviewedAt: record.reviewedAt?.toISOString() ?? null,
      createdAt: record.createdAt.toISOString(),
    };

    const group = groups.get(record.repoFullName);
    if (group) group.push(item);
    else groups.set(record.repoFullName, [item]);
  }

  return [...groups].map(([repoFullName, pullRequests]) => ({ repoFullName, pullRequests }));
}
