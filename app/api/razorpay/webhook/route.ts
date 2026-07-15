import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db.config";

type RazorpaySubscriptionPayload = {
  id: string;
  current_end?: number;
  notes?: { userId?: string };
};

type RazorpayWebhookBody = {
  event: string;
  payload: {
    subscription?: {
      entity: RazorpaySubscriptionPayload;
    };
  };
};

const HANDLED_EVENTS = new Set([
  "subscription.activated",
  "subscription.charged",
  "subscription.cancelled",
  "subscription.halted",
  "subscription.completed",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const secret = process.env.NEXT_PUBLIC_RAZORPAY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const expected = createHmac("sha256", secret).update(body).digest("hex");

  if (
    expected.length !== signature.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: RazorpayWebhookBody;
  try {
    event = JSON.parse(body) as RazorpayWebhookBody;
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.event)) {
    return Response.json({ received: true });
  }

  const subscription = event.payload.subscription?.entity;
  if (!subscription) {
    return Response.json({ error: "Missing subscription" }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: { razorpaySubscriptionId: subscription.id },
    select: { id: true },
  });

  const userId = existingUser?.id ?? subscription.notes?.userId ?? null;
  if (!userId) {
    console.error(
      "Razorpay webhook: no user for subscription",
      subscription.id,
      event.event
    );
    return Response.json({ received: true });
  }

  const renewsAt = subscription.current_end
    ? new Date(subscription.current_end * 1000)
    : null;

  if (event.event === "subscription.activated") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "pro",
        razorpaySubscriptionId: subscription.id,
        subscriptionStatus: "active",
        subscriptionRenewsAt: renewsAt,
      },
    });
  }

  if (event.event === "subscription.charged") {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionRenewsAt: renewsAt },
    });
  }

  if (event.event === "subscription.cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "canceled" },
    });
  }

  if (event.event === "subscription.halted") {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "halted" },
    });
  }

  if (event.event === "subscription.completed") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "free",
        subscriptionStatus: "canceled",
        subscriptionRenewsAt: null,
      },
    });
  }

  return Response.json({ received: true });
}