import { addMonths, format, formatDistanceToNow, startOfMonth } from 'date-fns';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Database,
  FolderGit2,
  GitPullRequest,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { GitHubIcon } from '@/components/landing/icons';
import { Button } from '@/components/ui/button';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { statusBadge, statusDotClass } from '@/features/dashboard/lib/status-styles';
import { getOverviewRepoSummary } from '@/features/overview/server/get-overview';
import type { OverviewActivityItem, OverviewData } from '@/features/overview/types/overview';
import { getPrStatusTone, PR_STATUS_LABELS } from '@/features/pull-requests/utils/status';
import { cn } from '@/lib/utils';
import { EmptyState, PANEL_ROW_HOVER, PANEL_ROWS, Panel, StatCard, StatCardSkeleton } from './ui';

/** Repository count from GitHub. Streams in so a slow GitHub never blocks the page. */
async function RepoStatCard({ installationId }: { installationId: number | null }) {
  const repos = installationId ? await getOverviewRepoSummary(installationId) : null;

  let caption = 'Connect the GitHub App';
  if (repos) {
    caption = repos.hasMorePages
      ? 'Connected through the app'
      : `${repos.publicCount} public · ${repos.privateCount} private`;
  } else if (installationId) {
    caption = 'GitHub is not responding';
  }

  return (
    <StatCard
      index={2}
      label="Repositories"
      value={repos ? repos.totalCount : '-'}
      caption={caption}
      icon={FolderGit2}
    />
  );
}

function StatsGrid({ overview }: { overview: OverviewData }) {
  const resetDate = format(startOfMonth(addMonths(new Date(), 1)), 'MMM d');
  const exhausted = overview.reviewsUsed >= overview.reviewsLimit;
  const planLabel = overview.plan === 'pro' ? 'Pro plan' : 'Free plan';

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        index={0}
        label="Reviews this month"
        value={overview.reviewsUsed}
        suffix={<span className="text-xl text-muted-foreground"> / {overview.reviewsLimit}</span>}
        caption={
          exhausted ? `Limit reached · resets ${resetDate}` : `${planLabel} · resets ${resetDate}`
        }
        icon={Sparkles}
        tone={exhausted ? 'warning' : 'default'}
      />
      <StatCard
        index={1}
        label="Pull requests"
        value={overview.breakdown.total}
        caption={`${overview.breakdown.reviewed} reviewed all time`}
        icon={GitPullRequest}
      />
      <Suspense fallback={<StatCardSkeleton />}>
        <RepoStatCard installationId={overview.installationId} />
      </Suspense>
      <StatCard
        index={3}
        label="Codebase context"
        value={overview.syncedRepoCount}
        caption={overview.syncedRepoCount === 1 ? 'Repository synced' : 'Repositories synced'}
        icon={Database}
      />
    </div>
  );
}

function OutcomesPanel({ overview }: { overview: OverviewData }) {
  const { breakdown } = overview;
  const rows = [
    { label: 'Reviewed', value: breakdown.reviewed, color: 'bg-primary' },
    { label: 'In progress', value: breakdown.inFlight, color: 'bg-sky-400' },
    { label: 'Limit reached', value: breakdown.rateLimited, color: 'bg-amber-500' },
    { label: 'Failed', value: breakdown.failed, color: 'bg-red-500' },
    { label: 'Nothing to review', value: breakdown.skipped, color: 'bg-muted-foreground/40' },
  ];

  return (
    <Panel title="Review outcomes" description="Every pull request ReviewRay has picked up">
      <div className="animate-grow-x flex h-2.5 w-full origin-left gap-0.5 overflow-hidden rounded-full bg-background">
        {rows
          .filter((row) => row.value > 0)
          .map((row) => (
            <span
              key={row.label}
              className={cn('h-full first:rounded-l-full last:rounded-r-full', row.color)}
              style={{ width: `${(row.value / breakdown.total) * 100}%` }}
            />
          ))}
      </div>
      <ul className="mt-5 space-y-1">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className="animate-fade-up flex items-center gap-3 rounded-lg px-2 py-1.5 text-[15px] transition-colors hover:bg-background/70"
            style={{ animationDelay: `${60 + index * 30}ms` }}
          >
            <span className={cn('size-2.5 rounded-full', row.color)} />
            <span className="flex-1">{row.label}</span>
            <span className="w-10 text-right font-mono text-sm text-muted-foreground tabular-nums">
              {row.value}
            </span>
            <span className="w-12 text-right font-mono text-sm tabular-nums">
              {Math.round((row.value / breakdown.total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function SetupChecklist({ overview }: { overview: OverviewData }) {
  const steps = [
    {
      title: 'Install the GitHub App',
      description: 'Give ReviewRay access to the repositories you choose.',
      done: overview.installation.connected,
      href: DASHBOARD_ROUTES.github,
      cta: 'Connect',
    },
    {
      title: 'Sync a repository',
      description: 'Optional. Lets reviews reference related code in your project.',
      done: overview.syncedRepoCount > 0,
      href: DASHBOARD_ROUTES.repos,
      cta: 'Sync',
    },
    {
      title: 'Open a pull request',
      description: 'ReviewRay reviews it automatically and comments on GitHub.',
      done: overview.breakdown.total > 0,
      href: undefined,
      cta: undefined,
    },
  ];
  const completed = steps.filter((step) => step.done).length;

  return (
    <Panel
      title="Get set up"
      description={`${completed} of ${steps.length} steps complete`}
      bodyClassName="p-2"
    >
      <ol className={PANEL_ROWS}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={cn(
              'animate-fade-up flex items-center gap-4 rounded-xl px-3 py-3.5',
              PANEL_ROW_HOVER,
            )}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors',
                step.done
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground',
              )}
            >
              {step.done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-[15px] font-medium',
                  step.done && 'text-muted-foreground line-through',
                )}
              >
                {step.title}
              </p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            {!step.done && step.href ? (
              <Button asChild size="sm" variant="secondary" className="shrink-0 bg-background">
                <Link href={step.href}>{step.cta}</Link>
              </Button>
            ) : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function ActivityRow({ item, index }: { item: OverviewActivityItem; index: number }) {
  const tone = getPrStatusTone(item.status);

  return (
    <li className="animate-fade-up" style={{ animationDelay: `${index * 30}ms` }}>
      <Link
        href={`${DASHBOARD_ROUTES.pullRequest}/${item.id}`}
        transitionTypes={['nav-forward']}
        className={cn('group flex items-center gap-4 rounded-xl px-3 py-3.5', PANEL_ROW_HOVER)}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium transition-colors group-hover:text-primary">
            {item.title}
          </p>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <GitPullRequest className="size-3.5 shrink-0" />
            {item.repoFullName}
            <span className="font-mono text-xs">#{item.prNumber}</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={statusBadge(tone)}>
            <span className={cn('size-1.5 rounded-full', statusDotClass[tone])} />
            {PR_STATUS_LABELS[item.status]}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </Link>
    </li>
  );
}

function ActivityPanel({ overview }: { overview: OverviewData }) {
  return (
    <Panel
      title="Recent pull requests"
      description="Latest reviews across your repositories"
      bodyClassName="p-2"
      action={
        overview.recentActivity.length > 0 ? (
          <Link
            href={DASHBOARD_ROUTES.pullRequest}
            className="group inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ) : null
      }
    >
      {overview.recentActivity.length > 0 ? (
        <ul className={PANEL_ROWS}>
          {overview.recentActivity.map((item, index) => (
            <ActivityRow key={item.id} item={item} index={index} />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={GitPullRequest}
          title="No pull requests yet"
          description="Open a pull request on a connected repository. The review shows up here and on GitHub."
          className="bg-background/60 py-10"
        />
      )}
    </Panel>
  );
}

function ConnectBanner() {
  return (
    <div className="animate-fade-up relative overflow-hidden rounded-2xl bg-accent/70 p-6 sm:p-8">
      <div className="bg-dots mask-fade-b pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-60" />
      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <span className="animate-float flex size-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <GitHubIcon className="size-5" />
          </span>
          <div>
            <h3 className="text-lg font-medium">Connect GitHub to start reviewing</h3>
            <p className="mt-1 max-w-lg text-[15px] text-muted-foreground">
              Install the ReviewRay app on your account or organization. Every new pull request is
              reviewed automatically.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="group h-10 rounded-lg px-5 shadow-sm shadow-primary/25 transition-all hover:-translate-y-0.5"
        >
          <Link href={DASHBOARD_ROUTES.github}>
            Connect GitHub
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function OverviewContent({ overview }: { overview: OverviewData }) {
  const needsSetup = !overview.installation.connected || overview.breakdown.total === 0;

  return (
    <>
      {!overview.installation.connected ? <ConnectBanner /> : null}
      <StatsGrid overview={overview} />
      <div className="animate-fade-up grid gap-4 [animation-delay:80ms] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {needsSetup ? (
          <SetupChecklist overview={overview} />
        ) : (
          <OutcomesPanel overview={overview} />
        )}
        <ActivityPanel overview={overview} />
      </div>
    </>
  );
}
