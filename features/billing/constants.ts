/** Reviews included per calendar month on the Free plan. */
export const FREE_MONTHLY_LIMIT = 1;

/** Reviews included per calendar month on the Pro plan. */
export const PRO_MONTHLY_LIMIT = 10;

/** Monthly review allowance for a plan. */
export function getMonthlyReviewLimit(plan: 'free' | 'pro'): number {
  return plan === 'pro' ? PRO_MONTHLY_LIMIT : FREE_MONTHLY_LIMIT;
}
