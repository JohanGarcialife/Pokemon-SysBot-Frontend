import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/lib/supabaseServer';
import { randomTradeCode } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para realizar pedidos masivos.' }, { status: 401 });
  }
  if (user.plan !== 'premium') {
    return NextResponse.json({ error: 'El pedido masivo es una función premium. Actualiza tu suscripción.' }, { status: 403 });
  }

  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const backendUrl = rawUrl.replace(/\\n/g, '').replace(/\n/g, '').trim();
  
  try {
    const body = await req.json();
    const orders = body.orders || [];
    if (!orders.length) {
      return NextResponse.json({ error: 'El pedido masivo necesita al menos 1 Pokémon.' }, { status: 400 });
    }

    const firstOrder = orders[0];
    const tradeCode = randomTradeCode();
    const gameVersion = firstOrder.game === 'za' ? 'legends-za' : (firstOrder.gameVersion?.toLowerCase() || 'scarlet');

    // Call Railway backend
    const res = await fetch(`${backendUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({
        team: orders,
        tradeCode,
        gameVersion
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = errText;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error) errMsg = parsed.error;
      } catch {}
      return NextResponse.json({ error: errMsg || `Backend returned ${res.status}` }, { status: res.status });
    }

    const backendResult = await res.json();

    return NextResponse.json({
      ok: true,
      legal: true,
      id: backendResult.orderId,
      game: firstOrder.game,
      isBulk: true,
      tradeCode,
      expiresIn: 1800,
      expiresAt: new Date(Date.now() + 1800 * 1000).toISOString(),
      orders,
      discord: { sent: true, method: 'queue' },
      discordStatus: 'Pedido masivo registrado en el bot de intercambio.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
