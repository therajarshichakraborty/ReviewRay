/**
 * Single pull request detail page (`/dashboard/pull-request/[id]`).
 *
 * Shows PR metadata, links to GitHub, and the full AI review markdown.
 * Returns 404 when the PR does not exist or belongs to another installation.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db.config';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeftIcon,
  BotIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  UserIcon,
} from 'lucide-react';

import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { statusBadge } from '@/features/dashboard/lib/status-styles';
import { getUserInstallationId } from '@/features/github/server/installation';
import { AiReviewMarkdown } from '@/features/pull-requests/components/ai-review-markdown';
import { getPullRequestById } from '@/features/pull-requests/server/get-pull-request';
import type { PullRequestStatus } from '@/features/pull-requests/types/pull-request';
import { PR_STATUS_LABELS, getPrStatusTone } from '@/features/pull-requests/utils/status';
import { requireAuth } from '@/lib/auth-session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Pull Request Review · Dashboard',
};

/**
 * Renders the AI review section based on status and available comment text.
 *
 * @param review - Markdown review comment or null if not ready.
 * @param status - PR lifecycle status (rate_limited shows upgrade message).
 * @returns Placeholder text or `AiReviewMarkdown` component.
 */
function ReviewBody({ review, status }: { review: string | null; status: PullRequestStatus }) {
  if (status === 'rate_limited') {
    return (
      <p className="text-sm text-muted-foreground">
        Monthly review limit reached. Upgrade to Pro for unlimited reviews, or wait until next month
        when your limit resets.
      </p>
    );
  }

  if (!review) {
    return (
      <p className="text-sm text-muted-foreground">
        The AI review is not ready yet. It will appear here once the reviewer finishes.
      </p>
    );
  }

  return <AiReviewMarkdown review={review} />;
}

/**
 * Pull request detail view with metadata and AI review card.
 *
 * @param params - Async route params containing the PR database `id`.
 * @returns Full detail page or `notFound()` when unauthorized/missing.
 */
export default async function PullRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);

  const pullRequest = await prisma.pullRequest.findUnique({
    where: { id },
  });

  if (!pullRequest) {
    notFound();
  }

  if (!installationId || pullRequest.installationId !== installationId) {
    redirect(`https://github.com/${pullRequest.repoFullName}/commit/${pullRequest.headSha}`);
  }

  const status = pullRequest.status as PullRequestStatus;
  const prUrl = `https://github.com/${pullRequest.repoFullName}/pull/${pullRequest.prNumber}`;
  const openedAgo = formatDistanceToNow(pullRequest.createdAt, {
    addSuffix: true,
  });

  return (
    <>
      <DashboardHeader
        title={`PR #${pullRequest.prNumber}`}
        description={pullRequest.repoFullName}
      />

      <div className="flex flex-col gap-6 p-6 max-w-5xl">
        <div>
          <Button variant="ghost" size="sm" asChild className="rounded-lg text-muted-foreground hover:text-foreground">
            <Link href={DASHBOARD_ROUTES.pullRequest}>
              <ArrowLeftIcon className="mr-1.5 size-4" />
              Back to pull requests
            </Link>
          </Button>
        </div>

        <Card className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              <GitPullRequestIcon className="size-4 text-muted-foreground/75" />
              <span className="text-foreground/90">{pullRequest.title}</span>
              <span className="text-xs font-normal text-muted-foreground">
                #{pullRequest.prNumber}
              </span>
              <span className={statusBadge(getPrStatusTone(status), 'ml-auto text-[10px] font-medium')}>
                {PR_STATUS_LABELS[status]}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground py-4">
            <span className="inline-flex items-center gap-1.5 font-light">
              <UserIcon className="size-3.5 text-muted-foreground/60" />
              {pullRequest.authorLogin ?? 'unknown'}
            </span>
            <span className="inline-flex items-center gap-1.5 font-light">
              <GitBranchIcon className="size-3.5 text-muted-foreground/60" />
              <span className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-foreground/80">{pullRequest.baseBranch}</span>
            </span>
            <span className="font-light">opened {openedAgo}</span>
            <Link
              href={prUrl}
              target="_blank"
              className="ml-auto inline-flex items-center gap-1 hover:text-foreground hover:underline transition-colors font-medium"
            >
              View on GitHub
              <ExternalLinkIcon className="size-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <BotIcon className="size-4 text-muted-foreground/75" />
              <span>AI Review</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ReviewBody review={pullRequest.reviewComment} status={status} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
