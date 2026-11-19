import { formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, ChevronRight, FolderGit2, GitBranch, GitPullRequest } from 'lucide-react';
import Link from 'next/link';

import { EmptyState, PANEL_ROW_HOVER, PANEL_ROWS } from '@/features/dashboard/components/ui';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { statusBadge, statusDotClass } from '@/features/dashboard/lib/status-styles';
import type {
  PullRequestItem,
  RepoPullRequests,
} from '@/features/pull-requests/types/pull-request';
import { getPrStatusTone, PR_STATUS_LABELS } from '@/features/pull-requests/utils/status';
import { cn } from '@/lib/utils';

function PullRequestRow({ pullRequest, index }: { pullRequest: PullRequestItem; index: number }) {
  const tone = getPrStatusTone(pullRequest.status);

  return (
    <li className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
      <Link
        href={`${DASHBOARD_ROUTES.pullRequest}/${pullRequest.id}`}
        className={cn('group flex items-center gap-4 rounded-xl px-3 py-3.5', PANEL_ROW_HOVER)}
      >
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg bg-background transition-transform duration-300 group-hover:scale-105',
            pullRequest.status === 'reviewed' ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <GitPullRequest className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium transition-colors group-hover:text-primary">
            {pullRequest.title}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono text-xs">#{pullRequest.prNumber}</span>
            <span>{pullRequest.authorLogin ?? 'unknown'}</span>
            <span className="inline-flex items-center gap-1">
              <GitBranch className="size-3.5" />
              <span className="font-mono text-xs">{pullRequest.baseBranch}</span>
            </span>
            <span>{formatDistanceToNow(new Date(pullRequest.createdAt), { addSuffix: true })}</span>
          </p>
        </div>
        <span className={statusBadge(tone, 'hidden sm:inline-flex')}>
          <span className={cn('size-1.5 rounded-full', statusDotClass[tone])} />
          {PR_STATUS_LABELS[pullRequest.status]}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </li>
  );
}

function RepoGroup({ repo, index }: { repo: RepoPullRequests; index: number }) {
  const count = repo.pullRequests.length;

  return (
    <section
      className="animate-fade-up overflow-hidden rounded-2xl bg-surface"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <header className="flex items-center gap-3 px-5 pt-4 pb-2">
        <FolderGit2 className="size-4 text-muted-foreground" />
        <h3 className="truncate text-sm font-medium">{repo.repoFullName}</h3>
        <span className="rounded-full bg-background px-2 py-px font-mono text-[11px] text-muted-foreground">
          {count}
        </span>
        <a
          href={`https://github.com/${repo.repoFullName}/pulls`}
          target="_blank"
          rel="noopener noreferrer"
          className="group ml-auto inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          GitHub
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </header>
      <ul className={cn('p-2', PANEL_ROWS)}>
        {repo.pullRequests.map((pullRequest, rowIndex) => (
          <PullRequestRow key={pullRequest.id} pullRequest={pullRequest} index={rowIndex} />
        ))}
      </ul>
    </section>
  );
}

export function PullRequestsList({ repos }: { repos: RepoPullRequests[] }) {
  if (repos.length === 0) {
    return (
      <EmptyState
        icon={GitPullRequest}
        title="No pull requests yet"
        description="Open a pull request on a repository the GitHub App can access. ReviewRay picks it up automatically and the review appears here and on GitHub."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {repos.map((repo, index) => (
        <RepoGroup key={repo.repoFullName} repo={repo} index={index} />
      ))}
    </div>
  );
}
