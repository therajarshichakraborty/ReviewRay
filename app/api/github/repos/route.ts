import { NextResponse } from 'next/server';

import { getServerSession } from '@/features/auth/server/session';
import { getUserInstallationId } from '@/features/github/server/installation';
import { getInstallationReposPage } from '@/features/github/server/repos';
import { getRepoSyncStatuses } from '@/features/repo-sync/server/repo-sync';

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const installationId = await getUserInstallationId(session.user.id);
  if (!installationId) {
    return NextResponse.json({ error: 'GitHub App not connected' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  try {
    const data = await getInstallationReposPage(installationId, page);
    const syncStatuses = await getRepoSyncStatuses(data.repos.map((repo) => repo.fullName));

    return NextResponse.json({
      ...data,
      repos: data.repos.map((repo) => ({
        ...repo,
        syncStatus: syncStatuses[repo.fullName] ?? null,
      })),
    });
  } catch (error) {
    console.error('[github] failed to list repositories:', error);
    return NextResponse.json({ error: 'Failed to load repositories' }, { status: 502 });
  }
}
