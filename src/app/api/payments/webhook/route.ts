import { NextRequest, NextResponse } from 'next/server';
import { stripe, planFromPriceId } from '@/lib/stripe';
import { supabase } from '@/lib/supabaseServer';

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: any;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log('[webhook] Event received:', event.type);

  try {
    switch (event.type) {
      // ─── Payment successful ───────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId || !planId) {
          console.warn('[webhook] Missing userId or planId in session metadata');
          break;
        }

        await updateUserPlan(userId, planId, session.subscription);
        console.log(`[webhook] Plan updated: user=${userId} plan=${planId}`);
        break;
      }

      // ─── Subscription renewed ─────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.billing_reason === 'subscription_cycle') {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const userId = sub.metadata?.userId;
          const priceId = sub.items.data[0]?.price?.id;
          const planId = priceId ? planFromPriceId(priceId) : null;

          if (userId && planId) {
            await updateUserPlan(userId, planId, invoice.subscription);
            console.log(`[webhook] Plan renewed: user=${userId} plan=${planId}`);
          }
        }
        break;
      }

      // ─── Subscription cancelled / expired ────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;

        if (userId) {
          await updateUserPlan(userId, 'free', null);
          console.log(`[webhook] Plan downgraded to free: user=${userId}`);
        }
        break;
      }

      // ─── Subscription updated (plan change) ──────────────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        const priceId = sub.items.data[0]?.price?.id;
        const planId = priceId ? planFromPriceId(priceId) : null;

        if (userId && planId && sub.status === 'active') {
          await updateUserPlan(userId, planId, sub.id);
          console.log(`[webhook] Plan changed: user=${userId} plan=${planId}`);
        }
        break;
      }

      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('[webhook] Handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Helper: update user plan in Supabase ──────────────────────────────────
async function updateUserPlan(
  userId: string,
  plan: string,
  subscriptionId: string | null
): Promise<void> {
  if (!supabase) {
    console.warn('[webhook] Supabase not configured, skipping plan update');
    return;
  }

  // Update user metadata via Supabase Admin API
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      plan,
      stripe_subscription_id: subscriptionId || null,
      plan_updated_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error(`[webhook] Failed to update user ${userId} plan:`, error.message);
    throw error;
  }
}
