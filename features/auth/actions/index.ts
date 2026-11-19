'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { getSafeCallbackPath } from '../utils';

/** Starts GitHub OAuth and redirects the browser to GitHub's consent screen. */
export async function signInWithGithub(formData: FormData) {
  const callback = formData.get('callbackUrl');
  const redirectTo = getSafeCallbackPath(typeof callback === 'string' ? callback : null);

  const result = await auth.api.signInSocial({
    body: { provider: 'github', callbackURL: redirectTo },
    headers: await headers(),
  });

  if (result.url) {
    redirect(result.url);
  }
}
