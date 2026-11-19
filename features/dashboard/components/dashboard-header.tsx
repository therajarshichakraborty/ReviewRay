import Link from 'next/link';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

type Crumb = { label: string; href?: string };

type DashboardHeaderProps = {
  /** Current page title, or the last item of a breadcrumb trail. */
  title: string;
  parents?: Crumb[];
  actions?: React.ReactNode;
};

/** Top bar of every dashboard page: sidebar toggle, breadcrumb, actions, theme. */
export function DashboardHeader({ title, parents = [], actions }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 bg-background/80 px-4 backdrop-blur-md md:rounded-t-xl lg:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground transition-transform hover:text-foreground active:scale-90" />
      <span className="h-4 w-px bg-muted" aria-hidden />
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
        {parents.map((crumb) => (
          <span key={crumb.label} className="flex min-w-0 items-center gap-2">
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="link-underline truncate pb-px text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="truncate text-muted-foreground">{crumb.label}</span>
            )}
            <span className="text-muted-foreground/50">/</span>
          </span>
        ))}
        <h1 className="animate-fade-in truncate font-medium">{title}</h1>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}

type PageIntroProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

/** Large page heading below the top bar ("Good evening, ..."). */
export function PageIntro({ title, description, actions }: PageIntroProps) {
  return (
    <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold tracking-[-0.025em] sm:text-[28px]">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-[15px] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
