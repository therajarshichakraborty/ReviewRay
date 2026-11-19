'use server';

import { redirect } from 'next/navigation';

import { getServerSession } from '@/features/auth/server/session';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import {
  cancelProSubscription,
  createProSubscription,
} from '@/features/billing/server/subscription';

export async function startProSubscription() {
  const session = await getServerSession();
  if (!session) redirect(SIGN_IN_PATH);

  return createProSubscription(session.user.id);
}

export async function cancelSubscription() {
  const session = await getServerSession();
  if (!session) redirect(SIGN_IN_PATH);

  await cancelProSubscription(session.user.id);
}
