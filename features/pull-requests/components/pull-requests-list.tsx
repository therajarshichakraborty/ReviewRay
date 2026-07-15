/**
 * Pull requests list UI grouped by repository.
 * Blue-slate aesthetic: blue PR icon, blue hover states, styled review accordion.
 */

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  BotIcon,
  ExternalLinkIcon,
  FolderGit2Icon,
  GitBranchIcon,
  GitPullRequestIcon,
  UserIcon,
} from 'lucide-react';

import type {
  PullRequestItem,
  RepoPullRequests,
} from '@/features/pull-requests/types/pull-request';
import { statusBadge } from '@/features/dashboard/lib/status-styles';
import { AiReviewMarkdown } from '@/features/pull-requests/components/ai-review-markdown';
import { PR_STATUS_LABELS, getPrStatusTone } from '@/features/pull-requests/utils/status';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function buildPrUrl(repoFullName: string, prNumber: number) {
  return `https://github.com/${repoFullName}/pull/${prNumber}`;
}

function buildRepoUrl(repoFullName: string) {
  return `https://github.com/${repoFullName}`;
}

function PullRequestMeta({ pullRequest }: { pullRequest: PullRequestItem }) {
  const openedAgo = formatDistanceToNow(new Date(pullRequest.createdAt), { addSuffix: true });

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/80 font-light">
      <span className="inline-flex items-center gap-1.5">
        <UserIcon className="size-3 text-blue-400/60" />
        {pullRequest.authorLogin ?? 'unknown'}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <GitBranchIcon className="size-3 text-blue-400/60" />
        <span className="font-mono text-[10px] bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-400">
          {pullRequest.baseBranch}
        </span>
      </span>
      <span>opened {openedAgo}</span>
    </div>
  );
}

function AiReviewAccordion({ pullRequest }: { pullRequest: PullRequestItem }) {
  if (pullRequest.status === 'rate_limited') {
    return (
      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-light italic border border-amber-300/40 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-1.5 rounded-lg w-fit">
        Monthly review limit reached — upgrade to Pro for unlimited reviews.
      </p>
    );
  }

  if (!pullRequest.reviewComment) {
    return (
      <p className="text-[11px] text-muted-foreground/70 font-light italic">
        The AI review will appear here once it is ready.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="review" className="border-none">
        <AccordionTrigger className="py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 no-underline hover:no-underline font-medium">
          <span className="inline-flex items-center gap-1.5">
            <BotIcon className="size-3.5" />
            View AI review
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0">
          <div className="rounded-xl border border-blue-100/60 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/20 p-4 overflow-x-auto text-xs">
            <AiReviewMarkdown review={pullRequest.reviewComment} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function PullRequestRow({
  repoFullName,
  pullRequest,
}: {
  repoFullName: string;
  pullRequest: PullRequestItem;
}) {
  const tone = getPrStatusTone(pullRequest.status);

  return (
    <div className="flex flex-col gap-3 border-b border-border/40 py-4 last:border-b-0 last:pb-0 first:pt-0 group">
      <div className="flex flex-wrap items-center gap-2">
        <GitPullRequestIcon className="size-4 shrink-0 text-blue-500/70" />
        <Link
          href={`${DASHBOARD_ROUTES.pullRequest}/${pullRequest.id}`}
          className="font-semibold text-sm hover:underline text-foreground/90 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
        >
          {pullRequest.title}
        </Link>
        <Link
          href={buildPrUrl(repoFullName, pullRequest.prNumber)}
          target="_blank"
          className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-mono font-light transition-colors"
        >
          #{pullRequest.prNumber}
        </Link>
        <span className={statusBadge(tone, 'ml-auto text-[10px] font-medium')}>
          {PR_STATUS_LABELS[pullRequest.status]}
        </span>
      </div>

      <PullRequestMeta pullRequest={pullRequest} />
      <AiReviewAccordion pullRequest={pullRequest} />
    </div>
  );
}

function RepoCard({ repo }: { repo: RepoPullRequests }) {
  const prCount = repo.pullRequests.length;
  const prLabel = prCount === 1 ? 'pull request' : 'pull requests';

  return (
    <Card className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden hover:border-blue-200/60 dark:hover:border-blue-900/40 transition-colors duration-200">
      <CardHeader className="border-b border-border/40 bg-blue-50/30 dark:bg-blue-950/10">
        <CardTitle className="flex flex-wrap items-center gap-2 text-sm">
          <FolderGit2Icon className="size-4 text-blue-500/80" />
          <span className="font-semibold">{repo.repoFullName}</span>
          <span className="font-normal text-xs text-muted-foreground">
            {prCount} {prLabel}
          </span>
          <Link
            href={buildRepoUrl(repo.repoFullName)}
            target="_blank"
            className="ml-auto inline-flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            View on GitHub
            <ExternalLinkIcon className="size-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {repo.pullRequests.map((pullRequest) => (
          <PullRequestRow
            key={pullRequest.id}
            repoFullName={repo.repoFullName}
            pullRequest={pullRequest}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function NoPullRequestsYet() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
        <GitPullRequestIcon className="size-6 text-blue-500" />
      </div>
      <p className="text-sm font-semibold text-foreground/80">No pull requests yet</p>
      <p className="max-w-sm text-xs text-muted-foreground font-light leading-relaxed">
        Open a pull request on a connected repository and the AI reviewer will pick it up
        automatically. Reviews show up here and as comments on GitHub.
      </p>
    </div>
  );
}

export function PullRequestsList({ repos }: { repos: RepoPullRequests[] }) {
  if (repos.length === 0) {
    return <NoPullRequestsYet />;
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {repos.map((repo) => (
        <RepoCard key={repo.repoFullName} repo={repo} />
      ))}
    </div>
  );
}
