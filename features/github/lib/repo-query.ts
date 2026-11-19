import { infiniteQueryOptions } from '@tanstack/react-query';

import type { DashboardRepo } from '@/features/dashboard/lib/types';

export type GithubReposPage = {
  repos: DashboardRepo[];
  totalCount: number;
  page: number;
  hasMore: boolean;
};

export const githubRepoKeys = {
  all: ['github', 'repos'] as const,
};

const REPOS_STALE_TIME = 5 * 60 * 1000;

export const githubReposInfiniteQuery = infiniteQueryOptions({
  queryKey: [...githubRepoKeys.all, 'list'],
  queryFn: async ({ pageParam }): Promise<GithubReposPage> => {
    const response = await fetch(`/api/github/repos?page=${pageParam}`);
    if (!response.ok) {
      throw new Error('Failed to load repositories');
    }
    return response.json();
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  staleTime: REPOS_STALE_TIME,
  // Keep sync badges fresh while an index job is running.
  refetchInterval: (query) =>
    query.state.data?.pages.some((page) =>
      page.repos.some((repo) => repo.syncStatus === 'pending' || repo.syncStatus === 'syncing'),
    )
      ? 5000
      : false,
});
