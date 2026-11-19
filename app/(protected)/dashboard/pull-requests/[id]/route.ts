import { redirect } from 'next/navigation';

import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';

/** Legacy URL. The detail page performs the ownership check. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`${DASHBOARD_ROUTES.pullRequest}/${encodeURIComponent(id)}`);
}
