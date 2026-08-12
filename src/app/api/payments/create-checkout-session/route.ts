import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_MAP } from '@/lib/stripe';
import { getUserFromHeader } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  // Require authenticated user
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para suscribirte.' }, { status: 401 });
  }

  try {
    const { planId, billing } = await req.json();

    // Validate plan
    const cycle = billing === 'annual' ? 'annual' : 'monthly';
    const priceId = PRICE_MAP[planId]?.[cycle];

    if (!priceId || priceId === 'PLACEHOLDER_UPDATE_ME') {
      return NextResponse.json(
        { error: `Plan "${planId}" no disponible en este momento. Contacta con soporte.` },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || 'https://www.pkdextrade.com';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/memberships.html?success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/memberships.html?cancelled=true`,
      metadata: {
        userId: user.id,
        planId,
        billing: cycle,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId,
        },
      },
      // Pre-fill email if available
      customer_email: user.email || undefined,
      // Allow promotion codes
      allow_promotion_codes: true,
      // Locale
      locale: 'es',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[stripe/checkout] Error creating session:', err);
    return NextResponse.json(
      { error: err.message || 'Error al crear la sesión de pago.' },
      { status: 500 }
    );
  }
}
