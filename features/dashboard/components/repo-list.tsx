'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { githubReposInfiniteQuery } from '@/features/github/lib/repo-query';
import { DashboardRepo } from '../lib/types';
import { statusBadge } from '../lib/status-styles';
import { LockIcon, LockKeyOpenIcon, StarIcon } from '@phosphor-icons/react';
import SyncRepoButton from '../../repo-sync/components/sync-repo';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'public' | 'private';

export function RepoList() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery(githubReposInfiniteQuery);

  const loading = isPending && !data;

  const repos = useMemo(() => {
    if (!data) {
      return [];
    }

    const loaded = data.pages.flatMap((page) => page.repos);
    return [...loaded].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const counts = {
    all: totalCount,
    public: repos.filter((repo) => repo.visibility === 'public').length,
    private: repos.filter((repo) => repo.visibility === 'private').length,
  };

  const visibleRepos = useMemo(() => {
    const query = search.toLowerCase();

    return repos.filter((repo) => {
      if (filter !== 'all' && repo.visibility !== filter) {
        return false;
      }

      if (query && !repo.fullName.toLowerCase().includes(query)) {
        return false;
      }

      return true;
    });
  }, [repos, filter, search]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  let footer: string | null = null;

  if (isFetchingNextPage) {
    footer = 'Loading more repositories…';
  } else if (hasNextPage) {
    footer = `Showing ${repos.length} of ${totalCount}`;
  } else if (repos.length > 0) {
    footer = `All ${repos.length} repositories loaded`;
  }

  let rows;

  if (loading) {
    rows = (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground">
          Loading repositories…
        </TableCell>
      </TableRow>
    );
  } else if (isError) {
    rows = (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground">
          Failed to load repositories.
        </TableCell>
      </TableRow>
    );
  } else if (visibleRepos.length === 0) {
    rows = (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground">
          No repositories found.
        </TableCell>
      </TableRow>
    );
  } else {
    rows = visibleRepos.map((repo) => <RepoRow key={repo.id} repo={repo} />);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      {/* Filtering and Search Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList className="bg-muted p-0.5 rounded-lg border border-border/50">
            <TabsTrigger
              value="all"
              className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger
              value="public"
              className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Public ({counts.public})
            </TabsTrigger>
            <TabsTrigger
              value="private"
              className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Private ({counts.private})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search repositories…"
          className="max-w-xs h-9 rounded-lg border-border/50 bg-background/50 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Modern Table Container */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30 border-b border-border/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Repository</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Visibility</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Branch</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Language</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 text-right">Stars</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 text-right">Updated</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 text-right">Codebase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/30">{rows}</TableBody>
        </Table>
      </div>

      <div ref={loadMoreRef} className="py-4 text-center text-xs text-muted-foreground font-light">
        {footer}
      </div>
    </div>
  );
}

function RepoRow({ repo }: { repo: DashboardRepo }) {
  const isPrivate = repo.visibility === 'private';

  return (
    <TableRow className="transition-colors hover:bg-muted/30 group">
      <TableCell className="py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {repo.name}
          </span>
          <span className="text-xs text-muted-foreground font-light">{repo.fullName}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border",
          isPrivate 
            ? "bg-muted border-border text-muted-foreground"
            : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
        )}>
          {isPrivate ? (
            <LockIcon className="size-3 text-muted-foreground" />
          ) : (
            <LockKeyOpenIcon className="size-3" />
          )}
          {repo.visibility}
        </span>
      </TableCell>
      <TableCell className="py-4 text-xs font-mono text-muted-foreground">{repo.defaultBranch}</TableCell>
      <TableCell className="py-4 text-xs text-foreground/80">{repo.language ?? '—'}</TableCell>
      <TableCell className="py-4 text-right">
        <span className="inline-flex items-center justify-end gap-1 text-xs text-muted-foreground font-light">
          <StarIcon className="size-3" />
          {repo.stars}
        </span>
      </TableCell>
      <TableCell className="py-4 text-right text-xs text-muted-foreground font-light">
        {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
      </TableCell>
      <TableCell className="py-4 text-right">
        <SyncRepoButton
          repoFullName={repo.fullName}
          branch={repo.defaultBranch}
          syncStatus={repo.syncStatus ?? null}
        />
      </TableCell>
    </TableRow>
  );
}
