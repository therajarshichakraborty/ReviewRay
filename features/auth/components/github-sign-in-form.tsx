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
      className="h-11 w-full rounded-lg bg-foreground text-[15px] text-background shadow-sm hover:bg-foreground/90"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <GitHubIcon className="size-4" />}
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
