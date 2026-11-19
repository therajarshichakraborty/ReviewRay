'use client';

import { ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export const MARKETING_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/workflow', label: 'Workflow' },
  { href: '/review', label: 'Review' },
  { href: '/pricing', label: 'Pricing' },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop navigation with an animated underline on the current page. */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
      {MARKETING_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'link-underline pb-0.5 text-sm transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Slide-over menu for small screens. */
export function MobileNav({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs gap-0 p-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <nav aria-label="Mobile" className="flex flex-col px-3 py-2">
          {MARKETING_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, link.href) ? 'page' : undefined}
              className="animate-fade-up flex items-center justify-between rounded-lg px-3 py-3 text-[17px] transition-colors hover:bg-muted aria-[current=page]:text-primary"
              style={{ animationDelay: `${80 + index * 50}ms` }}
            >
              {link.label}
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-5">
          <Button asChild className="h-11 w-full rounded-lg">
            <Link href={ctaHref} onClick={() => setOpen(false)}>
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/** Adds a soft shadow to the sticky header once the page scrolls. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-rail backdrop-blur-md transition-[background-color,box-shadow] duration-300',
        scrolled
          ? 'bg-background/85 shadow-[0_8px_30px_-12px] shadow-foreground/10'
          : 'bg-background/60',
      )}
    >
      {children}
    </header>
  );
}
