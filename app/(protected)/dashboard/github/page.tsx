import type { Metadata } from 'next';

import { requireAuth } from '@/features/auth/server/session';
import {
  DashboardHeader,
  PageBody,
  PageIntro,
} from '@/features/dashboard/components/dashboard-header';
import { GithubConnectCard } from '@/features/github/components/github-connect-card';
import { getInstallationStatus } from '@/features/github/server/installation';

export const metadata: Metadata = {
  title: 'GitHub App',
};

type GithubPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function DashboardGithubPage({ searchParams }: GithubPageProps) {
  const [{ status }, session] = await Promise.all([searchParams, requireAuth()]);
  const installation = await getInstallationStatus(session.user.id);
  const callbackStatus = status === 'connected' || status === 'error' ? status : undefined;

  return (
    <>
      <DashboardHeader title="GitHub App" />
      <PageBody className="max-w-4xl">
        <PageIntro
          title="GitHub App"
          description="Control which account ReviewRay is installed on and what it can access."
        />
        <GithubConnectCard
          userId={session.user.id}
          installation={installation}
          callbackStatus={callbackStatus}
        />
      </PageBody>
    </>
  );
}
