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
      <LogoMark className="size-10 rounded-[10px]" />
      <h1 className="mt-8 text-3xl font-semibold tracking-[-0.03em]">Sign in to ReviewRay</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Use your GitHub account. New here? Signing in creates your workspace with 5 free reviews.
      </p>

      <div className="mt-8">
        <GithubSignInForm callbackUrl={callbackUrl} />
      </div>

      <div className="mt-10 rounded-xl border bg-surface/60 p-4">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          What ReviewRay can do
        </p>
        <ul className="mt-3 space-y-2.5">
          {PERMISSIONS.map((permission) => (
            <li key={permission} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={3} />
              {permission}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
