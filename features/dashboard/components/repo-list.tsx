'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { FolderGit2, Globe, Lock, Search, Star } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { githubReposInfiniteQuery } from '@/features/github/lib/repo-query';
import SyncRepoButton from '@/features/repo-sync/components/sync-repo';
import type { DashboardRepo } from '../lib/types';
import { EmptyState } from './ui';

type Filter = 'all' | 'public' | 'private';

function RepoRow({ repo }: { repo: DashboardRepo }) {
  const isPrivate = repo.visibility === 'private';

  return (
    <li className="group animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl px-3 py-3.5 transition-colors duration-200 hover:bg-background/70">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
          <FolderGit2 className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={`https://github.com/${repo.fullName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[15px] font-medium hover:text-primary"
            >
              {repo.name}
            </a>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-background px-1.5 py-px text-[11px] text-muted-foreground">
              {isPrivate ? <Lock className="size-3" /> : <Globe className="size-3" />}
              {repo.visibility}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{repo.fullName}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm text-muted-foreground">
        <span className="hidden w-24 truncate md:inline">{repo.language ?? 'Unknown'}</span>
        <span className="hidden items-center gap-1 tabular-nums sm:inline-flex">
          <Star className="size-3.5" />
          {repo.stars}
        </span>
        <span className="hidden w-28 text-right lg:inline">
          {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
        </span>
        <SyncRepoButton
          repoFullName={repo.fullName}
          branch={repo.defaultBranch}
          syncStatus={repo.syncStatus ?? null}
        />
      </div>
    </li>
  );
}

function LoadingRows() {
  return (
    <ul className="divide-y-2 divide-background p-2">
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index} className="flex items-center gap-3 px-3 py-3.5">
          <Skeleton className="size-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-8 w-24" />
        </li>
      ))}
    </ul>
  );
}

export function RepoList() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery(githubReposInfiniteQuery);

  const repos = useMemo(
    () =>
      (data?.pages.flatMap((page) => page.repos) ?? []).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [data],
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const counts = {
    all: totalCount,
    public: repos.filter((repo) => repo.visibility === 'public').length,
    private: repos.filter((repo) => repo.visibility === 'private').length,
  };

  const visibleRepos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return repos.filter(
      (repo) =>
        (filter === 'all' || repo.visibility === filter) &&
        (!query || repo.fullName.toLowerCase().includes(query)),
    );
  }, [repos, filter, search]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  let body: React.ReactNode;
  if (isPending) {
    body = <LoadingRows />;
  } else if (isError) {
    body = (
      <div className="p-5">
        <EmptyState
          icon={FolderGit2}
          title="Could not load repositories"
          description="GitHub did not respond. Refresh the page to try again."
        />
      </div>
    );
  } else if (visibleRepos.length === 0) {
    body = (
      <div className="p-5">
        <EmptyState
          icon={Search}
          title="No repositories found"
          description={
            search
              ? `Nothing matches "${search}".`
              : 'The GitHub App has no repositories in this view.'
          }
        />
      </div>
    );
  } else {
    body = (
      <ul className="divide-y-2 divide-background p-2">
        {visibleRepos.map((repo) => (
          <RepoRow key={repo.id} repo={repo} />
        ))}
      </ul>
    );
  }

  let footer: string | null = null;
  if (isFetchingNextPage) footer = 'Loading more repositories';
  else if (hasNextPage) footer = `Showing ${repos.length} of ${totalCount}`;
  else if (repos.length > 0) footer = `All ${repos.length} repositories loaded`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList>
            <TabsTrigger className="dark:data-active:border-transparent" value="all">
              All · {counts.all}
            </TabsTrigger>
            <TabsTrigger className="dark:data-active:border-transparent" value="public">
              Public · {counts.public}
            </TabsTrigger>
            <TabsTrigger className="dark:data-active:border-transparent" value="private">
              Private · {counts.private}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter repositories"
            aria-label="Filter repositories"
            className="h-9 border-transparent bg-surface pl-9 shadow-none transition-colors focus-visible:bg-background"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="animate-fade-up overflow-hidden rounded-2xl bg-surface [animation-delay:80ms]">
        {body}
      </div>

      <div ref={loadMoreRef} className="py-2 text-center text-sm text-muted-foreground">
        {footer}
      </div>
    </div>
  );
}
