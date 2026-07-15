'use client';
/**
 * Top bar shown on every dashboard page.
 * Premium header: grid texture, gradient strip, bold title.
 */

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="relative flex h-16 shrink-0 items-center gap-2 overflow-hidden border-b border-border/50 bg-background/90 backdrop-blur-sm px-5">
      {/* Gradient strip */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />

      <SidebarTrigger className="-ml-1 relative shrink-0 text-muted-foreground hover:text-foreground transition-colors" />
      <Separator orientation="vertical" className="mr-2 h-5 bg-border/60 relative" />

      <div className="relative flex min-w-0 flex-col gap-0.5">
        <h1 className="truncate text-sm font-bold tracking-tight text-foreground leading-none">{title}</h1>
        {description ? (
          <p className="truncate text-[11px] text-muted-foreground font-light leading-none">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
