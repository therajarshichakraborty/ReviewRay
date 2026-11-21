/**
 * Instant loading states for dashboard routes. Next.js prefetches these with
 * every sidebar link, so a click paints the matching layout immediately while
 * the page's data streams in. Each skeleton mirrors its page's real footprint.
 */

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { DashboardHeader, PageBody } from './dashboard-header';
import { PANEL_ROWS, StatCardSkeleton } from './ui';

type Crumb = { label: string; href?: string };

function IntroSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4" aria-hidden>
      <div className="min-w-0 space-y-2.5">
        <Skeleton className="h-8 w-64 max-w-[70vw]" />
        <Skeleton className="h-4 w-96 max-w-[80vw]" />
      </div>
      {withAction ? <Skeleton className="h-10 w-44 rounded-lg" /> : null}
    </div>
  );
}

function RowsSkeleton({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <ul className={cn('p-2', PANEL_ROWS, className)} aria-hidden>
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex items-center gap-4 px-3 py-3.5">
          <Skeleton className="size-8 shrink-0 rounded-lg bg-background" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5 bg-background" />
            <Skeleton className="h-3 w-2/5 bg-background" />
          </div>
          <Skeleton className="hidden h-6 w-20 rounded-full bg-background sm:block" />
        </li>
      ))}
    </ul>
  );
}

function PanelSkeleton({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <section className={cn('overflow-hidden rounded-2xl bg-surface', className)} aria-hidden>
      <header className="space-y-2 px-5 pt-5 pb-1">
        <Skeleton className="h-4 w-36 bg-background" />
        <Skeleton className="h-3.5 w-56 bg-background" />
      </header>
      <RowsSkeleton rows={rows} />
    </section>
  );
}

function SkeletonFrame({
  title,
  parents,
  className,
  children,
}: {
  title: string;
  parents?: Crumb[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader title={title} parents={parents} />
      <PageBody className={className}>
        <span className="sr-only" role="status">
          Loading {title}
        </span>
        {children}
      </PageBody>
    </>
  );
}

export function OverviewSkeleton() {
  return (
    <SkeletonFrame title="Overview">
      <IntroSkeleton withAction />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <PanelSkeleton rows={3} />
        <PanelSkeleton rows={5} />
      </div>
    </SkeletonFrame>
  );
}

export function PullRequestsSkeleton() {
  return (
    <SkeletonFrame title="Pull requests">
      <IntroSkeleton />
      <div className="flex flex-col gap-5">
        <PanelSkeleton rows={4} />
        <PanelSkeleton rows={2} />
      </div>
    </SkeletonFrame>
  );
}

export function PullRequestDetailSkeleton() {
  return (
    <SkeletonFrame
      title="Review"
      parents={[{ label: 'Pull requests', href: '/dashboard/pull-request' }]}
      className="max-w-4xl"
    >
      <div aria-hidden>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="mt-4 h-8 w-4/5" />
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="ml-auto h-8 w-32 rounded-lg" />
        </div>
      </div>
      <div className="rounded-2xl bg-surface p-5 sm:p-7" aria-hidden>
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-6 rounded-md bg-background" />
          <Skeleton className="h-4 w-24 bg-background" />
        </div>
        <div className="mt-7 space-y-3">
          <Skeleton className="h-3 w-28 bg-background" />
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-11/12 bg-background" />
          <Skeleton className="h-4 w-4/6 bg-background" />
          <Skeleton className="mt-6 h-32 w-full rounded-xl bg-background" />
          <Skeleton className="h-4 w-10/12 bg-background" />
          <Skeleton className="h-4 w-3/5 bg-background" />
        </div>
      </div>
    </SkeletonFrame>
  );
}

export function ReposSkeleton() {
  return (
    <SkeletonFrame title="Repositories">
      <IntroSkeleton />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-72 rounded-lg" />
          <Skeleton className="h-9 w-full rounded-md sm:max-w-xs" />
        </div>
        <div className="overflow-hidden rounded-2xl bg-surface">
          <RowsSkeleton rows={6} />
        </div>
      </div>
    </SkeletonFrame>
  );
}

export function GithubSkeleton() {
  return (
    <SkeletonFrame title="GitHub App" className="max-w-4xl">
      <IntroSkeleton />
      <div className="rounded-2xl bg-surface p-6" aria-hidden>
        <div className="flex items-center gap-4">
          <Skeleton className="size-11 rounded-xl bg-background" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48 bg-background" />
            <Skeleton className="h-3.5 w-72 max-w-full bg-background" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-4/5 bg-background" />
        </div>
        <Skeleton className="mt-6 h-10 w-40 rounded-lg bg-background" />
      </div>
    </SkeletonFrame>
  );
}

export function SettingsSkeleton() {
  return (
    <SkeletonFrame title="Settings" className="max-w-4xl">
      <IntroSkeleton />
      <div className="flex flex-col gap-6" aria-hidden>
        <Skeleton className="h-9 w-56 rounded-lg" />
        <div className="rounded-2xl bg-surface p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full bg-background" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40 bg-background" />
              <Skeleton className="h-3.5 w-48 bg-background" />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full bg-background" />
            <Skeleton className="h-10 w-full bg-background" />
          </div>
        </div>
      </div>
    </SkeletonFrame>
  );
}
