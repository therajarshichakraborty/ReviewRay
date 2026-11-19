import { inngest } from '@/features/inngest/client';
import { getInstallationTier } from '@/features/billing/server/usage';
import { buildRepoNamespace } from '@/features/repo-sync/server/repo-sync';
import { prisma } from '@/lib/db.config';
import { generateReview } from './generate-review';
import { getPullRequestSnapshot } from './pr-files';
import { buildCommentBody, upsertPrComment } from './post-pr-comment';
import { searchCodeContext } from './vector';

/**
 * Review pipeline for one pull request:
 *
 * 1. Mark the PR as processing.
 * 2. Resolve the owner's plan (free runs on OpenRouter, pro on OpenAI).
 * 3. Fetch the PR description and changed files from GitHub.
 * 4. Retrieve related code from the synced codebase index, if any.
 * 5. Generate a budgeted, sanitized review.
 * 6. Post or update the review comment on GitHub and persist it.
 *
 * Every step is retried independently by Inngest; a terminal failure marks
 * the PR as failed so the dashboard never shows a review stuck in progress.
 */
export const reviewPullRequest = inngest.createFunction(
  {
    id: 'review-pull-request',
    triggers: { event: 'github/pr.received' },
    retries: 3,
    // Collapse rapid pushes to the same PR into a single review run.
    debounce: { key: 'event.data.pullRequestId', period: '20s' },
    concurrency: { limit: 10 },
    onFailure: async ({ event, error }) => {
      const pullRequestId = event.data.event.data.pullRequestId as string;
      console.error(`[review] PR ${pullRequestId} failed:`, error.message);
      await prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: { status: 'failed' },
      });
    },
  },
  async ({ event, step }) => {
    const pullRequestId = event.data.pullRequestId as string;

    const pullRequest = await step.run('mark-processing', () =>
      prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: { status: 'processing' },
      }),
    );

    const tier = await step.run('resolve-plan', () =>
      getInstallationTier(pullRequest.installationId),
    );

    const snapshot = await step.run('fetch-pr-diff', () =>
      getPullRequestSnapshot(
        pullRequest.installationId,
        pullRequest.repoFullName,
        pullRequest.prNumber,
      ),
    );

    const repoContextSnippets = await step.run('search-repo-context', async () => {
      const repoSync = await prisma.repoSync.findUnique({
        where: { repoFullName: pullRequest.repoFullName },
        select: { status: true },
      });
      if (repoSync?.status !== 'synced') return [];

      const changedPaths = snapshot.files.map((file) => file.filePath).slice(0, 15);
      const query = `${pullRequest.title}\n${changedPaths.join('\n')}`;

      try {
        return await searchCodeContext(buildRepoNamespace(pullRequest.repoFullName), query);
      } catch (error) {
        // Context is an enhancement; a vector store hiccup must not block the review.
        console.warn('[review] repo context search failed:', error);
        return [];
      }
    });

    const review = await step.run('generate-ai-review', () =>
      generateReview({
        repoFullName: pullRequest.repoFullName,
        title: pullRequest.title,
        description: snapshot.description,
        files: snapshot.files,
        repoContextSnippets,
        tier,
      }),
    );

    if (!review) {
      await step.run('mark-reviewed-no-code', () =>
        prisma.pullRequest.update({
          where: { id: pullRequestId },
          data: { status: 'skipped' },
        }),
      );
      return { pullRequestId, status: 'skipped', reason: 'no reviewable code' };
    }

    await step.run('post-pr-comment', () =>
      upsertPrComment(
        pullRequest.installationId,
        pullRequest.repoFullName,
        pullRequest.prNumber,
        buildCommentBody(review.markdown),
      ),
    );

    await step.run('mark-reviewed', () =>
      prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: {
          status: 'reviewed',
          reviewComment: review.markdown,
          reviewedAt: new Date(),
        },
      }),
    );

    return {
      pullRequestId,
      status: 'reviewed',
      tier,
      provider: review.provider,
      model: review.model,
      totalTokens: review.totalTokens,
    };
  },
);
