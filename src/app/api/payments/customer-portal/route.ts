import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserFromHeader } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para gestionar tu suscripción.' }, { status: 401 });
  }

  try {
    const email = user.email?.toLowerCase();
    if (!email) {
      return NextResponse.json({ error: 'El usuario no tiene un email configurado.' }, { status: 400 });
    }

    // Retrieve customers matching the email address
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'No tienes ninguna membresía activa vinculada a Stripe para gestionar.' },
        { status: 400 }
      );
    }

    const customerId = customers.data[0].id;
    const origin = req.headers.get('origin') || 'https://www.pkdextrade.com';

    // Create a Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[stripe/portal] Error generating customer portal session:', err);
    return NextResponse.json(
      { error: err.message || 'Error al conectar con la pasarela de pagos.' },
      { status: 500 }
    );
  }
}
