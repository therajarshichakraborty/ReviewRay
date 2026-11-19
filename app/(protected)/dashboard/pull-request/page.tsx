import { GitPullRequest } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { requireAuth } from '@/features/auth/server/session';
import {
  DashboardHeader,
  PageBody,
  PageIntro,
} from '@/features/dashboard/components/dashboard-header';
import { EmptyState } from '@/features/dashboard/components/ui';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { getUserInstallationId } from '@/features/github/server/installation';
import { PullRequestsList } from '@/features/pull-requests/components/pull-requests-list';
import { getPullRequestsByRepo } from '@/features/pull-requests/server/get-pull-requests';

export const metadata: Metadata = {
  title: 'Pull requests',
};

export default async function DashboardPullRequestsPage() {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);
  const repos = installationId ? await getPullRequestsByRepo(installationId) : [];

  return (
    <>
      <DashboardHeader title="Pull requests" />
      <PageBody>
        <PageIntro
          title="Pull requests"
          description="Every pull request ReviewRay has picked up, with its review."
        />
        {installationId ? (
          <PullRequestsList repos={repos} />
        ) : (
          <EmptyState
            icon={GitPullRequest}
            title="Connect GitHub first"
            description="Install the ReviewRay app on your GitHub account to see reviewed pull requests here."
            action={
              <Button asChild className="rounded-lg">
                <Link href={DASHBOARD_ROUTES.github}>Connect GitHub</Link>
              </Button>
            }
          />
        )}
      </PageBody>
    </>
  );
}
