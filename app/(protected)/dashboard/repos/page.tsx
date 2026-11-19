import { FolderGit2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { requireAuth } from '@/features/auth/server/session';
import {
  DashboardHeader,
  PageBody,
  PageIntro,
} from '@/features/dashboard/components/dashboard-header';
import { RepoList } from '@/features/dashboard/components/repo-list';
import { EmptyState } from '@/features/dashboard/components/ui';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { getInstallationStatus } from '@/features/github/server/installation';

export const metadata: Metadata = {
  title: 'Repositories',
};

export default async function DashboardReposPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  return (
    <>
      <DashboardHeader title="Repositories" />
      <PageBody>
        <PageIntro
          title="Repositories"
          description="Everything the GitHub App can access. Sync a repository to give its reviews codebase context."
        />
        {installation.connected ? (
          <RepoList />
        ) : (
          <EmptyState
            icon={FolderGit2}
            title="Connect GitHub first"
            description="Install the ReviewRay app on your GitHub account to list repositories and choose which ones to sync."
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
