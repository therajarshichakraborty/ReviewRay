import Link from 'next/link';

import { cn } from '@/lib/utils';

/** The ReviewRay mark: a stylised "R" with a ray point, on the brand blue. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn('size-7 shrink-0 rounded-[8px] shadow-sm shadow-primary/25', className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M9 22.5V9.5h6.2a4.1 4.1 0 0 1 0 8.2H9"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.6 17.7 21 22.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="23.2" cy="9.6" r="2.2" fill="#93C5FD" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('text-[15px] font-semibold tracking-tight', className)}>
      Review<span className="text-muted-foreground">Ray</span>
    </span>
  );
}

type LogoProps = {
  href?: string;
  className?: string;
  markClassName?: string;
};

export function Logo({ href = '/', className, markClassName }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="ReviewRay home"
      className={cn(
        'inline-flex items-center gap-2.5 transition-opacity hover:opacity-90',
        className,
      )}
    >
      <LogoMark className={markClassName} />
      <Wordmark />
    </Link>
  );
}
