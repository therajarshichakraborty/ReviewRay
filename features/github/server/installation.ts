import type { GithubInstallationStatus } from '@/features/dashboard/lib/types';
import { getGithubApp } from '@/features/github/utils/github-app';
import { cache } from 'react';

import { prisma } from '@/lib/db.config';

type InstallationAccount = { id?: number; login?: string; slug?: string } | null | undefined;

function getAccountLogin(account: InstallationAccount): string | null {
  return account?.login ?? account?.slug ?? null;
}

/**
 * The user's installation row. Memoized per request, so the layout, page and
 * overview helpers share a single query.
 */
const getInstallationRecord = cache(async (userId: string) =>
  prisma.githubInstallation.findUnique({
    where: { userId },
    select: { installationId: true, accountLogin: true, createdAt: true },
  }),
);

export async function getInstallationStatus(userId: string): Promise<GithubInstallationStatus> {
  const installation = await getInstallationRecord(userId);

  if (!installation) {
    return { connected: false, accountLogin: null, installedAt: null };
  }

  return {
    connected: true,
    accountLogin: installation.accountLogin,
    installedAt: installation.createdAt.toISOString(),
  };
}

async function getGithubAccount(userId: string) {
  return prisma.account.findFirst({
    where: { userId, providerId: 'github' },
    select: { accountId: true, accessToken: true },
  });
}

/**
 * Confirms via the user's own GitHub token that they can access the installation.
 * Returns `null` when the token type cannot answer (for example an OAuth App token).
 */
async function userCanAccessInstallation(
  accessToken: string,
  installationId: number,
): Promise<boolean | null> {
  try {
    const response = await fetch('https://api.github.com/user/installations?per_page=100', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { installations?: { id: number }[] };
    return (data.installations ?? []).some((installation) => installation.id === installationId);
  } catch {
    return null;
  }
}

/**
 * Links a GitHub App installation to a ReviewRay user after verifying ownership.
 *
 * The `installation_id` arrives as a query parameter, so it must never be
 * trusted on its own: otherwise any signed-in user could attach someone else's
 * installation and read their pull request reviews.
 */
export async function saveInstallation(userId: string, installationId: number) {
  if (!Number.isSafeInteger(installationId) || installationId <= 0) {
    throw new Error('Invalid installation id.');
  }

  const app = getGithubApp();
  const { data } = await app.octokit.request('GET /app/installations/{installation_id}', {
    installation_id: installationId,
  });

  const account = data.account as InstallationAccount;
  const githubAccount = await getGithubAccount(userId);
  if (!githubAccount) {
    throw new Error('Sign in with GitHub before connecting the app.');
  }

  const ownsPersonalInstallation =
    data.target_type === 'User' && String(account?.id) === githubAccount.accountId;

  if (!ownsPersonalInstallation) {
    const verified = githubAccount.accessToken
      ? await userCanAccessInstallation(githubAccount.accessToken, installationId)
      : null;

    if (verified === false || (verified === null && data.target_type === 'User')) {
      throw new Error('This GitHub App installation does not belong to your account.');
    }
  }

  const accountLogin = getAccountLogin(account);

  await prisma.githubInstallation.upsert({
    where: { userId },
    create: { userId, installationId, accountLogin, accountType: data.target_type ?? null },
    update: { installationId, accountLogin, accountType: data.target_type ?? null },
  });
}

export async function deleteInstallation(userId: string) {
  await prisma.githubInstallation.deleteMany({ where: { userId } });
}

export async function getUserIdByInstallationId(installationId: number) {
  const installation = await prisma.githubInstallation.findFirst({
    where: { installationId },
    select: { userId: true },
  });

  return installation?.userId ?? null;
}

export async function getUserInstallationId(userId: string) {
  const installation = await getInstallationRecord(userId);
  return installation?.installationId ?? null;
}
