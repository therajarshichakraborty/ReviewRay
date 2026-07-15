'use client';

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

type RazorpayButtonProps = {
  keyId: string;
  email: string;
  name: string;
};

/**
 * Opens Razorpay checkout for the Pro plan (₹199/month).
 *
 * Prerequisites:
 *   1. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local
 *   2. Add <Script src="https://checkout.razorpay.com/v1/checkout.js" /> to app/layout.tsx
 *   3. Create an order server action that calls Razorpay Orders API and returns `orderId`
 */
export default function RazorpayButton({ keyId, email, name }: RazorpayButtonProps) {
  const handlePayment = async () => {
    if (!keyId) {
      alert(
        'Razorpay is not configured yet.\n\nAdd NEXT_PUBLIC_RAZORPAY_KEY_ID to your .env.local to enable payments.',
      );
      return;
    }

    // TODO: Call your server action here to create a Razorpay order
    // const { orderId } = await createRazorpayOrder({ amount: 19900, currency: 'INR' });

    const options = {
      key: keyId,
      amount: 19900, // ₹199 in paise
      currency: 'INR',
      name: 'ReviewRay',
      description: 'Pro Plan — Unlimited AI Code Reviews',
      // order_id: orderId, // Uncomment after wiring server action
      prefill: {
        name,
        email,
      },
      theme: {
        color: '#2563eb', // blue-600
      },
      handler: function (response: { razorpay_payment_id: string }) {
        console.log('Payment successful:', response.razorpay_payment_id);
        // TODO: Verify payment on the server and activate Pro plan
        window.location.href = '/dashboard/settings?upgraded=true';
      },
    };

    if (typeof window !== 'undefined' && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Razorpay script not loaded — dynamically inject
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full h-11 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
      onClick={handlePayment}
    >
      <Zap className="mr-2 size-4" />
      Upgrade to Pro — ₹199/mo
    </Button>
  );
}
