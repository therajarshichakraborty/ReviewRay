import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { DesktopNav, HeaderShell, MobileNav } from '@/components/marketing-nav';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { getServerSession } from '@/features/auth/server/session';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';

export async function PublicHeader() {
  const session = await getServerSession();
  const isLoggedIn = Boolean(session?.user);
  const ctaHref = isLoggedIn ? DASHBOARD_ROUTES.overview : SIGN_IN_PATH;
  const ctaLabel = isLoggedIn ? 'Open dashboard' : 'Start reviewing';

  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-6 px-5 sm:border-x sm:border-rail sm:px-10 lg:px-12">
        <div className="flex items-center gap-10">
          <Logo />
          <DesktopNav />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          {isLoggedIn ? null : (
            <Link
              href={SIGN_IN_PATH}
              className="link-underline hidden pb-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Sign in
            </Link>
          )}
          <Button
            asChild
            className="group hidden h-9 rounded-lg px-4 shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/30 sm:inline-flex"
          >
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <MobileNav ctaHref={ctaHref} ctaLabel={ctaLabel} />
        </div>
      </div>
    </HeaderShell>
  );
}
