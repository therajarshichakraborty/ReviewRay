"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { githubReposInfiniteQuery } from "@/features/github/lib/repo-query"
import { DashboardRepo } from "../lib/types";
import { statusBadge } from "../lib/status-style";
import { LockIcon, LockKeyOpenIcon, StarIcon } from "@phosphor-icons/react";
//import SyncRepoButton from "@/features/repo-sync/action/repo-sync";

type Filter = "all" | "public" | "private";

export function RepoList() {
    const [filter, setFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        isError,
    } = useInfiniteQuery(githubReposInfiniteQuery)

    const loading = isPending && !data;

    const repos = useMemo(() => {
        if (!data) {
            return [];
        }

        const loaded = data.pages.flatMap((page) => page.repos);
        return [...loaded].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }, [data]);

    const totalCount = data?.pages[0]?.totalCount ?? 0;

    const counts = {
        all: totalCount,
        public: repos.filter((repo) => repo.visibility === "public").length,
        private: repos.filter((repo) => repo.visibility === "private").length,
      };

    const visibleRepos = useMemo(() => {
        const query = search.toLowerCase();
        
        return repos.filter((repo) => {
          if (filter !== "all" && repo.visibility !== filter) {
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
          { rootMargin: "200px" }
        );
    
        observer.observe(element);
        return () => observer.disconnect();
      }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

      let footer: string | null = null;

      if (isFetchingNextPage) {
        footer = "Loading more repositories…";
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
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={filter}
              onValueChange={(value) => setFilter(value as Filter)}
            >
              <TabsList>
                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                <TabsTrigger value="public">Public ({counts.public})</TabsTrigger>
                <TabsTrigger value="private">Private ({counts.private})</TabsTrigger>
              </TabsList>
            </Tabs>
            <Input
              placeholder="Search repositories…"
              className="max-w-xs"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
    
          <div className="rounded-none border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead className="text-right">Stars</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                  <TableHead className="text-right">Codebase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{rows}</TableBody>
            </Table>
          </div>
    
          <div ref={loadMoreRef} className="py-2 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>
      );
    
}


function RepoRow({ repo }: { repo: DashboardRepo }) {
    const tone = repo.visibility === "public" ? "info" : "warning";
  
    return (
      <TableRow>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">{repo.name}</span>
            <span className="text-xs text-muted-foreground">{repo.fullName}</span>
          </div>
        </TableCell>
        <TableCell>
          <span className={statusBadge(tone, "gap-1")}>
            {repo.visibility === "private" ? (
              <LockIcon className="size-3" />
            ) : (
              <LockKeyOpenIcon  className="size-3" />
            )}
            {repo.visibility}
          </span>
        </TableCell>
        <TableCell className="text-muted-foreground">{repo.defaultBranch}</TableCell>
        <TableCell>{repo.language ?? "—"}</TableCell>
        <TableCell className="text-right">
          <span className="inline-flex items-center justify-end gap-1 text-muted-foreground">
            <StarIcon className="size-3 text-amber-500" />
            {repo.stars}
          </span>
        </TableCell>
        <TableCell className="text-right text-muted-foreground">
          {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
        </TableCell>
        <TableCell className="text-right">
          {/* <SyncRepoButton
            repoFullName={repo.fullName}
            branch={repo.defaultBranch}
            syncStatus={repo.syncStatus ?? null}
          /> */}
        </TableCell>
      </TableRow>
    );
  }