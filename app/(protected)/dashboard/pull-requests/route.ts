import { redirect } from 'next/navigation';

import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';

/** Legacy URL kept for old links. */
export async function GET() {
  redirect(DASHBOARD_ROUTES.pullRequest);
}
