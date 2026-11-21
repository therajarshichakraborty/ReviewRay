import { auth } from '@/lib/auth';
import { getSafeCallbackPath, SIGN_IN_PATH } from './index';
import { NextRequest, NextResponse } from 'next/server';

function redirectToSignIn(request: NextRequest, pathname: string) {
  const signInUrl = new URL(SIGN_IN_PATH, request.url);
  signInUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

function getPostAuthRedirectPath(request: NextRequest): string {
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
  return getSafeCallbackPath(callbackUrl);
}

/** Copies refreshed session cookies (cookie cache renewals) onto the response. */
function forwardSetCookies(from: Headers, to: NextResponse) {
  for (const cookie of from.getSetCookie()) {
    to.headers.append('set-cookie', cookie);
  }
  return to;
}

export async function handleAuthProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.next();
  }

  // With the cookie cache enabled this is a signature check, not a database
  // query. When the cache has expired, the refreshed cookie is sent back so the
  // following navigations are cheap again.
  const { headers, response: session } = await auth.api.getSession({
    headers: request.headers,
    returnHeaders: true,
  });

  if (pathname === SIGN_IN_PATH) {
    if (session) {
      const redirectPath = getPostAuthRedirectPath(request);
      return forwardSetCookies(headers, NextResponse.redirect(new URL(redirectPath, request.url)));
    }

    return forwardSetCookies(headers, NextResponse.next());
  }

  if (!session) {
    return forwardSetCookies(headers, redirectToSignIn(request, pathname));
  }

  return forwardSetCookies(headers, NextResponse.next());
}
