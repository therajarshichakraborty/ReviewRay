import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { getInstallationStatus } from '@/features/github/server/installation';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/features/auth/actions';
import { RepoList } from '@/features/dashboard/components/repo-list';
import { FolderGit2Icon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Repositories · Dashboard',
};

function ReposNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center max-w-lg mx-auto">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted border border-border/50">
        <FolderGit2Icon className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground/80">Connect GitHub App first</p>
      <p className="text-xs text-muted-foreground font-light leading-relaxed">
        Install the ReviewRay app on your GitHub account to see your repositories and select which ones to sync.
      </p>
      <Button asChild size="sm" className="mt-2 rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
        <Link href={DASHBOARD_ROUTES.github}>Go to GitHub App Settings</Link>
      </Button>
    </div>
  );
}

/**
 * Repositories list page with GitHub connection guard.
 *
 * @returns Header plus either connect prompt or interactive repo table.
 */
export default async function DashboardReposPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  const header = (
    <DashboardHeader
      title="Repositories"
      description="All public and private repositories available to the GitHub App."
    />
  );

  if (!installation.connected) {
    return (
      <>
        {header}
        <ReposNotConnected />
      </>
    );
  }

  return (
    <>
      {header}
      <RepoList />
    </>
  );
}
