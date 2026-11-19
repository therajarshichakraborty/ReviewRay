import Link from 'next/link';
import { getServerSession } from '@/lib/auth-session';
import { Button } from '@/components/ui/button';
import { UserMenuWithSession } from '@/features/auth/components/user-menu';
import { ArrowRight, Sparkles } from 'lucide-react';

export async function PublicHeader() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/25">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-sans text-base font-bold tracking-tight text-slate-950 dark:text-white">
            ReviewRay
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/#features"
            className="transition-colors hover:text-slate-950 dark:hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="transition-colors hover:text-slate-950 dark:hover:text-white"
          >
            Workflow
          </Link>
          <Link
            href="/#codebase-review"
            className="transition-colors hover:text-slate-950 dark:hover:text-white"
          >
            Codebase Sync
          </Link>
          <Link
            href="/pricing"
            className="transition-colors hover:text-slate-950 dark:hover:text-white"
          >
            Pricing
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-950 dark:hover:text-white"
          >
            Docs
          </a>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-9 px-4 text-xs sm:text-sm font-medium rounded-full hidden sm:flex text-slate-700 dark:text-slate-200"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserMenuWithSession variant="compact" />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Button
                asChild
                size="sm"
                className="h-9 px-5 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition-all"
              >
                <Link href="/sign-in" className="flex items-center gap-1.5">
                  <span>Start reviewing</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
