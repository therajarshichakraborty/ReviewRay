import { FREE_MONTHLY_LIMIT, PRO_MONTHLY_LIMIT } from '@/features/billing/constants';
import type { SubscriptionPlan } from '@/features/dashboard/lib/types';

export type PlanDetails = {
  label: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
};

/** Single source of truth for plan copy across pricing, settings and the dashboard. */
export const PLAN_DETAILS: Record<SubscriptionPlan, PlanDetails> = {
  free: {
    label: 'Free',
    price: '₹0',
    cadence: 'free forever',
    tagline: 'For side projects and trying ReviewRay on real pull requests.',
    features: [
      `${FREE_MONTHLY_LIMIT} AI review per month`,
      'Public and private repositories',
      'Severity-ranked findings with fixes',
      'One living comment per pull request',
    ],
  },
  pro: {
    label: 'Pro',
    price: '₹199',
    cadence: 'per month',
    tagline: 'For developers who open pull requests every day.',
    features: [
      `${PRO_MONTHLY_LIMIT} AI reviews per month`,
      'Larger diff budget per review',
      'Codebase-aware context from synced repos',
      'Priority support',
    ],
  },
};
