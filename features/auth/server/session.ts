/**
 * Server-side session helpers for Server Components, route handlers and actions.
 *
 * Not a `'use server'` module on purpose: these helpers are imported by server
 * code only and must not be exposed as callable Server Action endpoints.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from '@/lib/auth';
import { DEFAULT_AUTH_CALLBACK, SIGN_IN_PATH } from '../utils';

/** Reads the current session. Memoized per request, so layouts and pages share one lookup. */
export const getServerSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/** Returns the session or redirects guests to sign-in. */
export async function requireAuth(redirectTo = SIGN_IN_PATH) {
  const session = await getServerSession();
  if (!session) redirect(redirectTo);
  return session;
}

/** Redirects signed-in users away from guest-only pages such as sign-in. */
export async function requireUnauth(redirectTo = DEFAULT_AUTH_CALLBACK) {
  const session = await getServerSession();
  if (session) redirect(redirectTo);
}
