'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cancelSubscription } from '@/features/billing/actions';

export function CancelSubscriptionButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    try {
      await cancelSubscription();
      toast.success('Subscription canceled. Pro stays active until the end of this period.');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not cancel subscription.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          disabled={disabled || loading}
          className="bg-background text-muted-foreground"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {disabled ? 'Cancellation scheduled' : 'Cancel subscription'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel your Pro subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            You keep unlimited reviews until the current billing period ends. After that your
            account moves to the Free plan with 5 reviews per month.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Pro</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} variant="destructive">
            Cancel subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
