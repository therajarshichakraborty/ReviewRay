import Razorpay from 'razorpay';

let razorpay: Razorpay | null = null;

/**
 * Server-only Razorpay credentials. The non-prefixed names are preferred because
 * `NEXT_PUBLIC_*` variables are meant for the browser; the legacy names are still
 * read so existing `.env` files keep working.
 */
export const razorpayEnv = {
  keyId: () => process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_TEST_API_KEY,
  keySecret: () =>
    process.env.RAZORPAY_KEY_SECRET ?? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_SECRET,
  planId: () => process.env.RAZORPAY_PLAN_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID,
  webhookSecret: () =>
    process.env.RAZORPAY_WEBHOOK_SECRET ?? process.env.NEXT_PUBLIC_RAZORPAY_WEBHOOK_SECRET,
};

export function getRazorpay() {
  if (!razorpay) {
    const keyId = razorpayEnv.keyId();
    const keySecret = razorpayEnv.keySecret();
    if (!keyId || !keySecret) {
      throw new Error('Razorpay is not configured.');
    }
    razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  return razorpay;
}
