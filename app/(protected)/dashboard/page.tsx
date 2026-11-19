import { GitPullRequest } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { requireAuth } from '@/features/auth/server/session';
import { getFirstName } from '@/features/auth/utils/display';
import {
  DashboardHeader,
  PageBody,
  PageIntro,
} from '@/features/dashboard/components/dashboard-header';
import { Greeting } from '@/features/dashboard/components/greeting';
import { OverviewContent } from '@/features/dashboard/components/overview-content';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { getOverview } from '@/features/overview/server/get-overview';

export const metadata: Metadata = {
  title: 'Overview',
};

export default async function DashboardOverviewPage() {
  const session = await requireAuth();
  const overview = await getOverview(session.user.id);

  return (
    <>
      <DashboardHeader title="Overview" />
      <PageBody>
        <PageIntro
          title={<Greeting name={getFirstName(session.user)} />}
          description="Here is what ReviewRay has been doing across your repositories."
          actions={
            <Button asChild className="h-10 rounded-lg px-4 shadow-sm shadow-primary/25">
              <Link href={DASHBOARD_ROUTES.pullRequest}>
                <GitPullRequest className="size-4" />
                View pull requests
              </Link>
            </Button>
          }
        />
        <OverviewContent overview={overview} />
      </PageBody>
    </>
  );
}
