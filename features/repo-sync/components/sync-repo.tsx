'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Check, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { githubRepoKeys } from '@/features/github/lib/repo-query';
import { syncRepoCodebase } from '@/features/repo-sync/action/repo-sync';
import type { RepoSyncStatus } from '../types';

type SyncRepoButtonProps = {
  repoFullName: string;
  branch: string;
  syncStatus: RepoSyncStatus | null;
};

export default function SyncRepoButton({ repoFullName, branch, syncStatus }: SyncRepoButtonProps) {
  const queryClient = useQueryClient();

  const syncRepo = useMutation({
    mutationFn: () => syncRepoCodebase(repoFullName, branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: githubRepoKeys.all });
      toast.success(`Indexing ${repoFullName}. Reviews will use it as context once done.`);
    },
    onError: (error) => {
      toast.error(`Could not sync ${repoFullName}: ${error.message}`);
    },
  });

  const syncing = syncRepo.isPending || syncStatus === 'pending' || syncStatus === 'syncing';

  if (syncing) {
    return (
      <Button size="sm" variant="secondary" disabled className="min-w-24 bg-background">
        <Loader2 className="size-3.5 animate-spin" />
        Syncing
      </Button>
    );
  }

  if (syncStatus === 'synced') {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="min-w-24 text-muted-foreground"
        onClick={() => syncRepo.mutate()}
        title="Re-index the default branch"
      >
        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        Synced
        <RefreshCw className="size-3 opacity-60" />
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      className="group/sync min-w-24 bg-background active:scale-95"
      onClick={() => syncRepo.mutate()}
    >
      {syncStatus === 'failed' ? (
        <AlertCircle className="size-3.5 text-red-500" />
      ) : (
        <RefreshCw className="size-3.5 transition-transform duration-500 group-hover/sync:rotate-180" />
      )}
      {syncStatus === 'failed' ? 'Retry' : 'Sync'}
    </Button>
  );
}
