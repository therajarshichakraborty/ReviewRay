'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { startProSubscription } from '@/features/billing/actions';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { cn } from '@/lib/utils';

type RazorpayOptions = {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: () => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = { open: () => void };

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
/** The key id is public by design; the secret never reaches the browser. */
const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_TEST_API_KEY;

let scriptPromise: Promise<void> | null = null;

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();

  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Could not load the payment window. Check your connection and try again.'));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

type UpgradeButtonProps = {
  className?: string;
  children?: React.ReactNode;
  prefill?: { name?: string; email?: string };
};

export function UpgradeButton({
  className,
  children = 'Upgrade to Pro',
  prefill,
}: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!RAZORPAY_KEY_ID) {
      toast.error('Payments are not configured yet.');
      return;
    }

    setLoading(true);
    try {
      const [{ subscriptionId }] = await Promise.all([
        startProSubscription(),
        loadCheckoutScript(),
      ]);
      if (!window.Razorpay) throw new Error('Payment window is unavailable.');

      const checkout = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: 'ReviewRay',
        description: 'Pro plan, unlimited AI reviews',
        prefill,
        theme: { color: '#2563eb' },
        handler: () => {
          toast.success('Payment received. Pro activates in a few seconds.');
          router.push(`${DASHBOARD_ROUTES.settings}?tab=billing`);
          router.refresh();
        },
        modal: { ondismiss: () => setLoading(false) },
      });

      checkout.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not start checkout.');
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleUpgrade}
      disabled={loading}
      className={cn('shadow-sm shadow-primary/25', className)}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
      {loading ? 'Opening checkout' : children}
    </Button>
  );
}
