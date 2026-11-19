export const SIGN_IN_PATH = '/sign-in';
export const DEFAULT_AUTH_CALLBACK = '/dashboard';

/**
 * Keeps post-login redirects on this site. Only single-slash relative paths are
 * allowed; `//evil.com` and absolute URLs fall back to the dashboard, which
 * prevents open-redirect phishing through `callbackUrl`.
 */
export function getSafeCallbackPath(callbackUrl: string | null | undefined): string {
  if (
    callbackUrl?.startsWith('/') &&
    !callbackUrl.startsWith('//') &&
    !callbackUrl.startsWith('/\\')
  ) {
    return callbackUrl;
  }
  return DEFAULT_AUTH_CALLBACK;
}
