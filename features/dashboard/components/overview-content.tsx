/**
 * Dashboard Overview page body — stat cards, connect banner, and activity feed.
 *
 * Receives pre-fetched `OverviewData` from the server page and renders
 * four summary cards plus a list of recent AI review activity.
 */

import type { ComponentType } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FolderGit2Icon, GitPullRequestIcon, SparklesIcon } from 'lucide-react';

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

/** Maps activity status values to badge label and color tone. */
const ACTIVITY_STATUS = {
  approved: { label: 'Approved', tone: 'success' as const },
  changes_requested: { label: 'Changes requested', tone: 'warning' as const },
  rate_limited: { label: 'Rate limited', tone: 'danger' as const },
};

/**
 * Builds the subtitle text under the Repositories stat value.
 *
 * @param repos - Repo summary counts, or empty state when total is zero.
 * @returns A short human-readable description string.
 */
function getRepoDescription(repos: OverviewRepoSummary): string {
  if (repos.totalCount === 0) {
    return 'No repositories selected for the app';
  }

  if (repos.hasMorePages) {
    return `${repos.totalCount} repositories connected`;
  }

  return `${repos.publicCount} public · ${repos.privateCount} private`;
}

/**
 * Derives display value and description for the GitHub App stat card.
 *
 * @param installation - Connection status from `OverviewData`.
 * @returns Value string, description, and optional success accent.
 */
function getGithubStat(installation: OverviewData['installation']) {
  if (!installation.connected) {
    return {
      value: 'Not connected',
      description: 'Install the GitHub App to start',
      accent: undefined,
    };
  }

  const account = installation.accountLogin
    ? `@${installation.accountLogin}`
    : 'Installation active';

  return {
    value: 'Connected',
    description: account,
    accent: 'success' as const,
  };
}

/**
 * Derives display value for the Repositories stat card.
 *
 * @param repos - Repo summary or null when GitHub is not connected.
 * @returns Value, description, and optional info accent.
 */
function getRepositoriesStat(repos: OverviewRepoSummary | null) {
  if (!repos) {
    return {
      value: '—',
      description: 'Connect GitHub App first',
      accent: undefined,
    };
  }

  return {
    value: String(repos.totalCount),
    description: getRepoDescription(repos),
    accent: 'info' as const,
  };
}

/** Shape of one stat card in the top grid. */
type StatCard = {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent?: 'success' | 'info';
};

/**
 * Formats the "Reviews this month" stat for free vs Pro plans.
 *
 * @param overview - Full overview data including usage and plan.
 * @returns Value and description strings for the reviews stat card.
 */
function getReviewsStat(overview: OverviewData) {
  if (overview.reviewsLimit === null) {
    return {
      value: String(overview.reviewsUsed),
      description: 'Unlimited reviews on Pro',
    };
  }

  return {
    value: `${overview.reviewsUsed} / ${overview.reviewsLimit}`,
    description: 'AI reviews used this month',
  };
}

/**
 * Assembles all four stat cards from overview data.
 *
 * @param overview - Server-loaded overview payload.
 * @returns Array of stat card configs for rendering the grid.
 */
function buildStats(overview: OverviewData): StatCard[] {
  const repoStat = getRepositoriesStat(overview.repos);
  const githubStat = getGithubStat(overview.installation);
  const planLabel = PLAN_DETAILS[overview.plan].label;
  const reviewsStat = getReviewsStat(overview);

  return [
    {
      title: 'Repositories',
      value: repoStat.value,
      description: repoStat.description,
      icon: FolderGit2Icon,
      accent: repoStat.accent,
    },
    {
      title: 'Reviews this month',
      value: reviewsStat.value,
      description: reviewsStat.description,
      icon: GitPullRequestIcon,
    },
    {
      title: 'GitHub App',
      value: githubStat.value,
      description: githubStat.description,
      icon: GithubIcon,
      accent: githubStat.accent,
    },
    {
      title: 'Current plan',
      value: planLabel,
      description: 'Manage in settings',
      icon: SparklesIcon,
      accent: overview.plan === 'free' ? undefined : 'success',
    },
  ];
}

/**
 * Prominent CTA shown when GitHub App is not connected.
 *
 * @returns A highlighted card linking to the GitHub App settings page.
 */
function ConnectGithubBanner() {
  return (
    <Card className="border-neutral-300 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/20 backdrop-blur-sm transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-700">
      <CardHeader className="flex flex-row items-center justify-between gap-4 py-5 px-6">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold tracking-tight">Connect GitHub to get started</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light">
            Install the GitHub App to list repositories and enable AI reviews on pull requests.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="shrink-0 rounded-lg">
          <Link href={DASHBOARD_ROUTES.github}>Connect GitHub</Link>
        </Button>
      </CardHeader>
    </Card>
  );
}

/**
 * Renders the recent activity list or an empty-state message.
 *
 * @param items - Recent review activity rows from the server.
 * @returns A vertical list of activity entries with status badges.
 */
function ActivityList({ items }: { items: OverviewActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground font-light">
          No reviews yet. Once AI PR reviews are enabled, summaries will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/40">
      {items.map((item) => {
        const config = ACTIVITY_STATUS[item.status];

        return (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-2 py-4 last:pb-0 first:pt-0"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-tight text-foreground/90">
                {item.repoFullName}{" "}
                <span className="text-muted-foreground font-normal">#{item.prNumber}</span>
              </p>
              <p className="text-[10px] text-muted-foreground font-light">
                {formatDistanceToNow(new Date(item.reviewedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <span className={statusBadge(config.tone, "text-[10px] font-medium")}>{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}

type OverviewContentProps = {
  overview: OverviewData;
};

/**
 * Main Overview page content — stat grid, optional banner, activity card.
 *
 * @param overview - Pre-fetched data from `getOverview()`.
 * @returns The overview page body below `DashboardHeader`.
 */
export function OverviewContent({ overview }: OverviewContentProps) {
  const stats = buildStats(overview);
  const showConnectBanner = !overview.installation.connected;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-border/60 bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-700 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground font-light">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {showConnectBanner ? <ConnectGithubBanner /> : null}

      <Card className="border-border/60 bg-card/40 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold tracking-tight">Recent activity</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light">Latest AI review summaries from your repositories.</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityList items={overview.recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
}
