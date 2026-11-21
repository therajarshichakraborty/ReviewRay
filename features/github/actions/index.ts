'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getServerSession } from '@/features/auth/server/session';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { deleteInstallation } from '../server/installation';

export async function disconnectGithubApp() {
  const session = await getServerSession();
  if (!session) redirect(SIGN_IN_PATH);

  await deleteInstallation(session.user.id);
  // Drop cached dashboard pages so no tab still shows the old installation.
  revalidatePath('/dashboard', 'layout');
  redirect(DASHBOARD_ROUTES.github);
}
