import type { UserSubscription } from '@/features/dashboard/lib/types';
import { getRazorpay } from '@/features/billing/lib/razorpay';
import { prisma } from '@/lib/db.config';

export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      subscriptionStatus: true,
      subscriptionRenewsAt: true,
    },
  });

  if (!user) {
    return { plan: 'free', status: 'active', renewsAt: null };
  }

  const renewsAt = user.subscriptionRenewsAt?.toISOString() ?? null;

  if (user.plan !== 'pro') {
    return { plan: 'free', status: 'active', renewsAt };
  }

  if (user.subscriptionStatus === 'pending') {
    return { plan: 'free', status: 'trialing', renewsAt };
  }

  if (user.subscriptionStatus === 'canceled') {
    const stillActive =
      user.subscriptionRenewsAt !== null && user.subscriptionRenewsAt > new Date();

    if (stillActive) {
      return { plan: 'pro', status: 'active', renewsAt };
    }

    return { plan: 'free', status: 'canceled', renewsAt };
  }

  if (user.subscriptionStatus === 'active') {
    return { plan: 'pro', status: 'active', renewsAt };
  }

  return { plan: 'free', status: 'canceled', renewsAt };
}

export async function createProSubscription(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (subscription.plan === 'pro' && subscription.status === 'active') {
    throw new Error('You already have an active Pro subscription.');
  }

  const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;
  if (!planId) {
    throw new Error('Razorpay plan is not configured.');
  }

  const razorpay = getRazorpay();
  const razorpaySubscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    customer_notify: 1,
    notes: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      razorpaySubscriptionId: razorpaySubscription.id,
      subscriptionStatus: 'pending',
    },
  });

  return { subscriptionId: razorpaySubscription.id };
}

export async function cancelProSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { razorpaySubscriptionId: true },
  });

  if (!user?.razorpaySubscriptionId) {
    throw new Error('No active subscription found.');
  }

  const razorpay = getRazorpay();
  await razorpay.subscriptions.cancel(user.razorpaySubscriptionId, 1);

  await prisma.user.update({
    where: { id: userId },
    data: { subscriptionStatus: 'canceled' },
  });
}
