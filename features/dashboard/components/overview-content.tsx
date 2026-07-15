/**
 * Dashboard Overview page body — stat cards, connect banner, and activity feed.
 * Clean, premium aesthetic with subtle borders and high-contrast accents.
 */

import type { ComponentType } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FolderGit2Icon, GitPullRequestIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react';

import { GithubIcon } from '@/features/dashboard/components/icons/github-icon';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { statusBadge } from '@/features/dashboard/lib/status-styles';
import type {
  OverviewActivityItem,
  OverviewData,
  OverviewRepoSummary,
} from '@/features/overview/types/overview';
import { PLAN_DETAILS } from '@/features/settings/lib/plan-details';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ACTIVITY_STATUS = {
  approved: { label: 'Approved', tone: 'success' as const },
  changes_requested: { label: 'Changes requested', tone: 'warning' as const },
  rate_limited: { label: 'Rate limited', tone: 'danger' as const },
};

function getRepoDescription(repos: OverviewRepoSummary): string {
  if (repos.totalCount === 0) return 'No repositories selected';
  if (repos.hasMorePages) return `${repos.totalCount} connected`;
  return `${repos.publicCount} public · ${repos.privateCount} private`;
}

function getGithubStat(installation: OverviewData['installation']) {
  if (!installation.connected) {
    return { value: 'Not connected', description: 'Install the GitHub App to start', accent: undefined };
  }
  const account = installation.accountLogin ? `@${installation.accountLogin}` : 'Installation active';
  return { value: 'Connected', description: account, accent: 'success' as const };
}

function getRepositoriesStat(repos: OverviewRepoSummary | null) {
  if (!repos) return { value: '—', description: 'Connect GitHub App first', accent: undefined };
  return { value: String(repos.totalCount), description: getRepoDescription(repos), accent: 'info' as const };
}

type StatCard = {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent?: 'success' | 'info';
};

function getReviewsStat(overview: OverviewData) {
  if (overview.reviewsLimit === null) {
    return { value: String(overview.reviewsUsed), description: 'Unlimited reviews on Pro' };
  }
  return { value: `${overview.reviewsUsed} / ${overview.reviewsLimit}`, description: 'AI reviews used this month' };
}

function buildStats(overview: OverviewData): StatCard[] {
  const repoStat = getRepositoriesStat(overview.repos);
  const githubStat = getGithubStat(overview.installation);
  const planLabel = PLAN_DETAILS[overview.plan].label;
  const reviewsStat = getReviewsStat(overview);

  return [
    { title: 'Repositories', value: repoStat.value, description: repoStat.description, icon: FolderGit2Icon, accent: repoStat.accent },
    { title: 'Reviews this month', value: reviewsStat.value, description: reviewsStat.description, icon: GitPullRequestIcon },
    { title: 'GitHub App', value: githubStat.value, description: githubStat.description, icon: GithubIcon, accent: githubStat.accent },
    { title: 'Current plan', value: planLabel, description: 'Manage in settings', icon: SparklesIcon, accent: overview.plan === 'free' ? undefined : 'success' },
  ];
}

function ConnectGithubBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] to-transparent dark:from-blue-500/[0.01] pointer-events-none" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground border border-border/50">
            <GithubIcon className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold tracking-tight text-foreground">Connect GitHub to get started</p>
            <p className="text-xs text-muted-foreground font-light">
              Install the GitHub App to list repositories and enable AI reviews on pull requests.
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="shrink-0 rounded-full h-8 px-4 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors">
          <Link href={DASHBOARD_ROUTES.github}>Connect GitHub</Link>
        </Button>
      </div>
    </div>
  );
}

function ActivityList({ items }: { items: OverviewActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted border border-border/50">
          <TrendingUpIcon className="size-4 text-muted-foreground" />
        </div>
        <p className="text-xs font-medium text-foreground/70">No activity yet</p>
        <p className="text-[11px] text-muted-foreground font-light max-w-xs">
          Once AI PR reviews are enabled, summaries will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/40">
      {items.map((item) => {
        const config = ACTIVITY_STATUS[item.status];
        return (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3.5 last:pb-0 first:pt-0 group">
            <div className="flex items-center gap-3">
              <div className="size-1.5 rounded-full bg-blue-500 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold tracking-tight text-foreground/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.repoFullName}{' '}
                  <span className="text-muted-foreground font-mono font-normal">#{item.prNumber}</span>
                </p>
                <p className="text-[10px] text-muted-foreground font-light">
                  {formatDistanceToNow(new Date(item.reviewedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <span className={statusBadge(config.tone)}>{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}

type OverviewContentProps = { overview: OverviewData };

export function OverviewContent({ overview }: OverviewContentProps) {
  const stats = buildStats(overview);
  const showConnectBanner = !overview.installation.connected;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-border/50 bg-card hover:border-blue-500/40 dark:hover:border-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                {stat.title}
              </CardTitle>
              <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border/50">
                <stat.icon className="size-3.5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-0.5">
              <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-light">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {showConnectBanner ? <ConnectGithubBanner /> : null}

      {/* Activity feed */}
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-sm font-semibold tracking-tight">Recent activity</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light">
            Latest AI review summaries from your repositories.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ActivityList items={overview.recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
}
