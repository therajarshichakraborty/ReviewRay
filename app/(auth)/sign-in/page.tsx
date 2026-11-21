import { Check } from 'lucide-react';
import type { Metadata } from 'next';

import { LogoMark } from '@/components/brand/logo';
import { GithubSignInForm } from '@/features/auth/components/github-sign-in-form';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to ReviewRay with GitHub to start reviewing pull requests.',
};

const PERMISSIONS = [
  'Read pull requests on repositories you select',
  'Post one review comment per pull request',
  'Never push code or change repository settings',
];

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div>
      <LogoMark className="animate-pop-in size-10 rounded-[10px]" />
      <h1 className="animate-fade-up mt-8 [animation-delay:60ms] text-3xl font-semibold tracking-[-0.03em]">
        Sign in to ReviewRay
      </h1>
      <p className="animate-fade-up mt-2 [animation-delay:120ms] text-[15px] leading-relaxed text-muted-foreground">
        Use your GitHub account. New here? Signing in creates your workspace with 1 free review
        every month.
      </p>

      <div className="animate-fade-up mt-8 [animation-delay:180ms]">
        <GithubSignInForm callbackUrl={callbackUrl} />
      </div>

      <div className="animate-fade-up mt-10 [animation-delay:260ms] rounded-xl border border-border/70 bg-white p-4 dark:bg-surface/60">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          What ReviewRay can do
        </p>
        <ul className="mt-3 space-y-2.5">
          {PERMISSIONS.map((permission, index) => (
            <li
              key={permission}
              className="animate-fade-up flex items-start gap-2.5 text-sm"
              style={{ animationDelay: `${340 + index * 70}ms` }}
            >
              <Check
                className="animate-pop-in mt-0.5 size-3.5 shrink-0 text-primary"
                style={{ animationDelay: `${440 + index * 70}ms` }}
                strokeWidth={3}
              />
              {permission}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
