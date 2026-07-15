/**
 * Pull requests list page (`/dashboard/pull-request`).
 *
 * Groups AI-reviewed PRs by repository. Requires a GitHub App installation;
 * otherwise shows a prompt to connect GitHub first.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { GitPullRequestIcon } from 'lucide-react';

import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { getUserInstallationId } from '@/features/github/server/installation';
import { PullRequestsList } from '@/features/pull-requests/components/pull-requests-list';
import { getPullRequestsByRepo } from '@/features/pull-requests/server/get-pull-requests';
import { requireAuth } from '@/lib/auth-session';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Pull Requests · Dashboard',
};

/**
 * Empty state when GitHub App is not installed.
 *
 * @returns Centered message with link to GitHub App settings.
 */
function PullRequestsNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center max-w-lg mx-auto">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted border border-border/50">
        <GitPullRequestIcon className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground/80">Connect GitHub App first</p>
      <p className="text-xs text-muted-foreground font-light leading-relaxed">
        Install the ReviewRay app on your GitHub account to see and manage AI-reviewed pull requests.
      </p>
      <Button asChild size="sm" className="mt-2 rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
        <Link href={DASHBOARD_ROUTES.github}>Go to GitHub App Settings</Link>
      </Button>
    </div>
  );
}

/**
 * Pull requests index — all PRs grouped by repo for the user's installation.
 *
 * @returns Header plus list or connect prompt.
 */
export default async function DashboardPullRequestsPage() {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);

  const header = (
    <DashboardHeader
      title="Pull Requests"
      description="Every pull request the AI reviewer has picked up, with its review."
    />
  );

  if (!installationId) {
    return (
      <>
        {header}
        <PullRequestsNotConnected />
      </>
    );
  }

  const repos = await getPullRequestsByRepo(installationId);

  return (
    <>
      {header}
      <PullRequestsList repos={repos} />
    </>
  );
}
