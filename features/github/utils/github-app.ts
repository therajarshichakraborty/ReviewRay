import { App } from 'octokit';

let githubApp: App | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set.`);
  return value;
}

export function getGithubApp() {
  if (!githubApp) {
    githubApp = new App({
      appId: requireEnv('GITHUB_APP_ID'),
      privateKey: requireEnv('GITHUB_APP_PRIVATE_KEY').replace(/\\n/g, '\n'),
      webhooks: { secret: requireEnv('GITHUB_WEBHOOK_SECRET') },
    });
  }

  return githubApp;
}

/** Public install URL for the GitHub App. `state` lets the callback match the user. */
export function getGithubInstallUrl(userId: string) {
  const appSlug = process.env.GITHUB_APP_NAME?.trim() || 'reviewray';
  const url = new URL(`https://github.com/apps/${appSlug}/installations/new`);
  url.searchParams.set('state', userId);
  return url.toString();
}
