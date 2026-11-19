import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { Section } from './primitives';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/workflow', label: 'Workflow' },
      { href: '/review', label: 'Sample review' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: SIGN_IN_PATH, label: 'Sign in' },
      { href: DASHBOARD_ROUTES.overview, label: 'Dashboard' },
      { href: DASHBOARD_ROUTES.github, label: 'GitHub App' },
      { href: DASHBOARD_ROUTES.settings, label: 'Billing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/workflow#how-it-works', label: 'Getting started' },
      { href: 'https://docs.github.com/en/apps', label: 'GitHub Apps docs', external: true },
      {
        href: 'https://github.com/settings/installations',
        label: 'Manage installations',
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <Section>
      <footer className="px-5 pt-16 pb-10 sm:px-10 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              The AI reviewer that reads your pull requests in the context of your codebase.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs text-muted-foreground">{column.title}</p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline pb-0.5 text-[15px] transition-colors hover:text-primary"
                      {...('external' in link && link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-dashed border-rail pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ReviewRay. Built for developers who ship.</p>
          <p className="font-mono text-xs">reviews posted, not promised.</p>
        </div>
      </footer>
    </Section>
  );
}
