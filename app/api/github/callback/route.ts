import { redirect } from 'next/navigation';

import { getServerSession } from '@/features/auth/server/session';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { saveInstallation } from '@/features/github/server/installation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const installationId = searchParams.get('installation_id');
  const session = await getServerSession();

  if (!session) {
    const callbackUrl = installationId
      ? `/api/github/callback?installation_id=${encodeURIComponent(installationId)}`
      : DASHBOARD_ROUTES.github;
    redirect(`${SIGN_IN_PATH}?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!installationId) {
    redirect(DASHBOARD_ROUTES.github);
  }

  let status = 'connected';
  try {
    await saveInstallation(session.user.id, Number(installationId));
  } catch (error) {
    console.warn('[github] installation link rejected:', error);
    status = 'error';
  }

  redirect(`${DASHBOARD_ROUTES.github}?status=${status}`);
}
