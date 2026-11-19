'use server';

import { redirect } from 'next/navigation';

import { getServerSession } from '@/features/auth/server/session';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { deleteInstallation } from '../server/installation';

export async function disconnectGithubApp() {
  const session = await getServerSession();
  if (!session) redirect(SIGN_IN_PATH);

  await deleteInstallation(session.user.id);
  redirect(DASHBOARD_ROUTES.github);
}
