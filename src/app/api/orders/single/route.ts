import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/lib/supabaseServer';
import { randomTradeCode } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para realizar un intercambio.' }, { status: 401 });
  }
  
  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const backendUrl = rawUrl.replace(/\\n/g, '').replace(/\n/g, '').trim();

  try {
    const body = await req.json();
    const orderPayload = body.order || body;
    
    // Generate tradeCode and determine gameVersion
    const tradeCode = randomTradeCode();
    const gameVersion = orderPayload.game === 'za' ? 'legends-za' : (orderPayload.gameVersion?.toLowerCase() || 'scarlet');

    // Call Railway backend
    const res = await fetch(`${backendUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({
        team: [orderPayload],
        tradeCode,
        gameVersion
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      try {
        const parsed = JSON.parse(errText);
        return NextResponse.json(parsed, { status: res.status });
      } catch {}
      return NextResponse.json({ error: errText || `Backend returned ${res.status}` }, { status: res.status });
    }

    const backendResult = await res.json();
    
    // Map backend response back to format expected by frontend trade room
    return NextResponse.json({
      ok: true,
      legal: true,
      id: backendResult.orderId,
      game: orderPayload.game,
      isBulk: false,
      tradeCode,
      expiresIn: 1800,
      expiresAt: new Date(Date.now() + 1800 * 1000).toISOString(),
      order: orderPayload,
      discord: { sent: true, method: 'queue' },
      discordStatus: 'Orden registrada en el bot de intercambio.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
