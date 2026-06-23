'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from '../../auth/actions';
import { getUserInstallationId } from '../../github/server/installation';
import { DASHBOARD_ROUTES } from '../../dashboard/lib/routes';
import { triggerRepoSync } from '../server/repo-sync';

export async function syncRepoCodebase(repoFullName: string, branch: string) {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in');
  }

  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    redirect(DASHBOARD_ROUTES.github);
  }

  await triggerRepoSync(installationId, repoFullName, branch);
}
