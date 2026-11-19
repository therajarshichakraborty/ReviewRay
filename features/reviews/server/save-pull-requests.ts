import type { PullRequestWebhookPayload } from '@/features/github/types/webhook';
import { prisma } from '@/lib/db.config';

export async function savePullRequest(payload: PullRequestWebhookPayload) {
  const repoFullName = payload.repository.full_name;
  const prNumber = payload.pull_request.number;

  return prisma.pullRequest.upsert({
    where: {
      repoFullName_prNumber: { repoFullName, prNumber },
    },
    create: {
      installationId: payload.installation.id,
      repoFullName,
      prNumber,
      title: payload.pull_request.title,
      authorLogin: payload.pull_request.user?.login ?? null,
      headSha: payload.pull_request.head.sha,
      baseBranch: payload.pull_request.base.ref,
      status: 'pending',
    },
    update: {
      installationId: payload.installation.id,
      title: payload.pull_request.title,
      headSha: payload.pull_request.head.sha,
      baseBranch: payload.pull_request.base.ref,
      status: 'pending',
    },
  });
}
