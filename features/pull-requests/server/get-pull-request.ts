import { prisma } from '@/lib/db.config';

/**
 * Fetches one pull request scoped to the user's installation, so a user can
 * never read another tenant's review by guessing an id.
 */
export async function getPullRequestById(installationId: number, pullRequestId: string) {
  return prisma.pullRequest.findFirst({
    where: { id: pullRequestId, installationId },
  });
}
