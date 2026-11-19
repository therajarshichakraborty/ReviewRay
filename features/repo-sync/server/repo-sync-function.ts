import { inngest } from '@/features/inngest/client';
import { prisma } from '@/lib/db.config';
import {
  buildRepoNamespace,
  chunkRepoFiles,
  deleteRepoNamespace,
  getRepoFiles,
  saveRepoChunks,
} from '@/features/repo-sync/server/repo-sync';

export const syncRepoCodebaseFunction = inngest.createFunction(
  {
    id: 'sync-repo-codebase',
    triggers: { event: 'repo/sync.requested' },
    retries: 2,
    // One sync per repository at a time; a second click waits instead of racing.
    concurrency: { key: 'event.data.repoSyncId', limit: 1 },
    onFailure: async ({ event }) => {
      await prisma.repoSync.update({
        where: { id: event.data.event.data.repoSyncId },
        data: { status: 'failed' },
      });
    },
  },
  async ({ event, step }) => {
    const repoSyncId = event.data.repoSyncId as string;

    const repoSync = await step.run('mark-syncing', () =>
      prisma.repoSync.update({
        where: { id: repoSyncId },
        data: { status: 'syncing' },
      }),
    );

    // Fetch, chunk and upsert in one step so file contents never travel through
    // Inngest's step state (which has a size limit); only the count is returned.
    const chunkCount = await step.run('index-codebase', async () => {
      const files = await getRepoFiles(
        repoSync.installationId,
        repoSync.repoFullName,
        repoSync.branch,
      );
      const chunks = chunkRepoFiles(files);
      const namespace = buildRepoNamespace(repoSync.repoFullName);

      if (repoSync.syncedAt) {
        await deleteRepoNamespace(namespace);
      }
      await saveRepoChunks(namespace, chunks);

      return chunks.length;
    });

    await step.run('mark-synced', () =>
      prisma.repoSync.update({
        where: { id: repoSyncId },
        data: { status: 'synced', syncedAt: new Date(), chunkCount },
      }),
    );

    return { repoSyncId, status: 'synced', chunkCount };
  },
);
