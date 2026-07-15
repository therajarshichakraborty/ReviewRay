'use client';
/**
 * Top bar shown on every dashboard page.
 * Contains the sidebar toggle, page title, and optional description.
 */

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-sm px-4">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-border/60" />
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="truncate text-[11px] text-muted-foreground font-light">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
