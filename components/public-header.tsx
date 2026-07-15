import Link from 'next/link';
import { getServerSession } from '@/lib/auth-session';
import { Button } from '@/components/ui/button';
import { GithubLogo } from '@phosphor-icons/react/dist/ssr';
import { UserMenuWithSession } from '@/features/auth/components/user-menu';
import { ArrowRight } from 'lucide-react';

export async function PublicHeader() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center px-4 py-4 pointer-events-none">
      <header className="pointer-events-auto w-full md:w-[75%] max-w-5xl h-12 rounded-xl border border-border/30 bg-background/50 backdrop-blur-md shadow-lg shadow-black/[0.02] dark:shadow-black/[0.2] transition-all flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-background shadow-sm">
            <span className="font-mono text-[10px] font-black">R</span>
          </div>
          <span className="font-sans text-xs font-semibold tracking-tight">ReviewRay</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[11px] text-muted-foreground">
          <Link href="/#features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="/#how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground font-medium text-blue-600 dark:text-blue-400">Pricing</Link>
          <Link href="https://github.com" target="_blank" className="transition-colors hover:text-foreground">Docs</Link>
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button asChild size="sm" variant="ghost" className="h-7 px-3 text-[11px] rounded-full hidden sm:flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserMenuWithSession variant="compact" />
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost" className="h-7 px-3 text-[11px] rounded-full hidden sm:flex">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="h-7 px-3 text-[11px] rounded-full bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm">
                <Link href="/sign-in"><GithubLogo className="mr-1.5 size-3" />Get started</Link>
              </Button>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
