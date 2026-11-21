import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  GitBranch,
  Loader2,
  SearchX,
  User,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LogoMark } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/features/auth/server/session';
import { DashboardHeader, PageBody } from '@/features/dashboard/components/dashboard-header';
import { EmptyState } from '@/features/dashboard/components/ui';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { statusBadge, statusDotClass } from '@/features/dashboard/lib/status-styles';
import { getUserInstallationId } from '@/features/github/server/installation';
import { AiReviewMarkdown } from '@/features/pull-requests/components/ai-review-markdown';
import { getPullRequestById } from '@/features/pull-requests/server/get-pull-request';
import {
  toPullRequestStatus,
  type PullRequestStatus,
} from '@/features/pull-requests/types/pull-request';
import { getPrStatusTone, PR_STATUS_LABELS } from '@/features/pull-requests/utils/status';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Pull request review',
};

function ReviewPlaceholder({ status }: { status: PullRequestStatus }) {
  switch (status) {
    case 'rate_limited':
      return (
        <EmptyState
          icon={Clock}
          title="Monthly review limit reached"
          description="This pull request arrived after this month's reviews were used. Free includes 1 review a month and Pro includes 10. Push again after the limit resets on the 1st."
          action={
            <Button asChild className="rounded-lg">
              <Link href="/pricing">See Pro</Link>
            </Button>
          }
        />
      );
    case 'failed':
      return (
        <EmptyState
          icon={AlertTriangle}
          iconClassName="text-amber-500"
          title="The review could not be completed"
          description="The AI provider did not respond after several retries. Push a new commit to the pull request to try again."
        />
      );
    case 'skipped':
      return (
        <EmptyState
          icon={SearchX}
          title="Nothing to review"
          description="This pull request only changes generated files, lockfiles, binaries or deletions."
        />
      );
    default:
      return (
        <EmptyState
          icon={Loader2}
          iconClassName="animate-spin text-primary"
          title="Review in progress"
          description="ReviewRay is reading the diff. This usually takes under a minute; refresh to see the result."
        />
      );
  }
}

export default async function PullRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);
  const pullRequest = installationId ? await getPullRequestById(installationId, id) : null;

  // Missing and not-yours look identical, so ids cannot be probed.
  if (!pullRequest) notFound();

  const status = toPullRequestStatus(pullRequest.status);
  const tone = getPrStatusTone(status);
  const prUrl = `https://github.com/${pullRequest.repoFullName}/pull/${pullRequest.prNumber}`;

  return (
    <>
      <DashboardHeader
        title={`#${pullRequest.prNumber}`}
        parents={[
          { label: 'Pull requests', href: DASHBOARD_ROUTES.pullRequest },
          { label: pullRequest.repoFullName },
        ]}
      />
      <PageBody className="max-w-4xl">
        <div className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className={statusBadge(tone)}>
              <span className={cn('size-1.5 rounded-full', statusDotClass[tone])} />
              {PR_STATUS_LABELS[status]}
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              {pullRequest.repoFullName}#{pullRequest.prNumber}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-balance sm:text-[28px]">
            {pullRequest.title}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" />
              {pullRequest.authorLogin ?? 'unknown'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="size-4" />
              into{' '}
              <span className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                {pullRequest.baseBranch}
              </span>
            </span>
            <span>opened {formatDistanceToNow(pullRequest.createdAt, { addSuffix: true })}</span>
            <Button asChild variant="secondary" size="sm" className="group ml-auto">
              <a href={prUrl} target="_blank" rel="noopener noreferrer">
                Open on GitHub
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
          </div>
        </div>

        {pullRequest.reviewComment && status === 'reviewed' ? (
          <article className="animate-fade-up overflow-hidden rounded-2xl bg-surface [animation-delay:50ms]">
            <header className="flex items-center gap-2.5 px-5 pt-5 sm:px-7">
              <LogoMark className="size-6 rounded-md" />
              <span className="text-sm font-medium">ReviewRay</span>
              <span className="rounded-full bg-background px-1.5 py-px text-[10px] text-muted-foreground">
                bot
              </span>
              {pullRequest.reviewedAt ? (
                <span className="ml-auto text-sm text-muted-foreground">
                  {format(pullRequest.reviewedAt, "MMM d, yyyy 'at' h:mm a")}
                </span>
              ) : null}
            </header>
            <div className="p-5 sm:p-7">
              <AiReviewMarkdown review={pullRequest.reviewComment} />
            </div>
          </article>
        ) : (
          <ReviewPlaceholder status={status} />
        )}
      </PageBody>
    </>
  );
}
