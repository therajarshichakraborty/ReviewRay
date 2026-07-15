'use client';

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { startProSubscription } from '@/lib/billing';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

type RazorpayButtonProps = {
  keyId: string;
  email: string;
  name: string;
};

export default function RazorpayButton({ keyId, email, name }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (!keyId) {
      alert(
        'Razorpay is not configured yet.\n\nAdd NEXT_PUBLIC_RAZORPAY_TEST_API_KEY to your env variables.',
      );
      return;
    }

    setLoading(true);

    try {
      // Create subscription in Database and get subscription ID from Razorpay
      const { subscriptionId } = await startProSubscription();

      const options = {
        key: keyId,
        subscription_id: subscriptionId,
        name: 'ReviewRay',
        description: 'Pro Plan - Unlimited AI Code Reviews',
        prefill: {
          name,
          email,
        },
        theme: {
          color: '#2563eb', // blue-600
        },
        handler: function (response: any) {
          toast.success('Payment successful! Your Pro plan will activate shortly.');
          router.push('/dashboard/settings?upgraded=true');
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
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
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Could not start checkout.';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full h-11 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
      disabled={loading}
      onClick={handlePayment}
    >
      <Zap className="mr-2 size-4" />
      {loading ? 'Opening Checkout…' : 'Upgrade to Pro — ₹199/mo'}
    </Button>
  );
}
