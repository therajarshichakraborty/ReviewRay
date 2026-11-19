'use server';

import { redirect } from 'next/navigation';

import { getServerSession } from '@/features/auth/server/session';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { getUserInstallationId } from '@/features/github/server/installation';
import { triggerRepoSync } from '../server/repo-sync';

const REPO_NAME_PATTERN = /^[\w.-]+\/[\w.-]+$/;

export async function syncRepoCodebase(repoFullName: string, branch: string) {
  const session = await getServerSession();
  if (!session) redirect(SIGN_IN_PATH);

  if (!REPO_NAME_PATTERN.test(repoFullName) || !branch || branch.length > 255) {
    throw new Error('Invalid repository or branch.');
  }

  const installationId = await getUserInstallationId(session.user.id);
  if (!installationId) redirect(DASHBOARD_ROUTES.github);

  await triggerRepoSync(installationId, repoFullName, branch);
}
