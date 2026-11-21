'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { GitHubIcon } from '@/components/landing/icons';
import { Button } from '@/components/ui/button';
import { signInWithGithub } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group h-11 w-full rounded-lg bg-foreground text-[15px] text-background shadow-sm transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-px hover:bg-foreground/90 hover:shadow-md active:translate-y-0 active:scale-[0.985]"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <GitHubIcon className="size-4 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110" />
      )}
      {pending ? 'Redirecting to GitHub' : 'Continue with GitHub'}
    </Button>
  );
}

type GithubSignInFormProps = {
  /** Optional post-login redirect path, validated on the server. */
  callbackUrl?: string;
};

export function GithubSignInForm({ callbackUrl }: GithubSignInFormProps) {
  return (
    <form action={signInWithGithub} className="w-full">
      {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}
      <SubmitButton />
    </form>
  );
}
