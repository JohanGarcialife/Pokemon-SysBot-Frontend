import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Falta ID de orden.' }, { status: 400 });
  }

  // 1. Try to fetch from Railway backend for full rich logs and queuePosition
  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const backendUrl = rawUrl.replace(/\\n/g, '').replace(/\n/g, '').trim();

  try {
    const res = await fetch(`${backendUrl}/api/orders/${id}/status`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      next: { revalidate: 0 } // disable cache
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      console.warn(`[orders/status] Backend returned status ${res.status}, falling back to Supabase`);
    }
  } catch (err: any) {
    console.warn('[orders/status] Backend fetch failed, falling back to Supabase:', err.message || err);
  }

  // 2. Fallback to Supabase directly
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Orden no encontrada.' }, { status: 404 });
      }

      const payload = (data.team_payload || []) as any[];
      const firstPokemon = payload[0] || {};

      const order = {
        id: data.id,
        game: firstPokemon.game || (data.game_version?.includes('legends') ? 'za' : 'sv'),
        status: data.status || 'pending',
        tradeCode: data.trade_code,
        isBulk: payload.length > 1,
        queuePosition: null,
        items: payload.map((p: any) => ({
          displayName: p.displayName || p.species,
          species: p.dexId || p.species,
          dexId: p.dexId || p.species,
          form: p.form || 0,
          shiny: Boolean(p.shiny),
          level: p.level || null,
          status: data.status,
        })),
        logs: [
          {
            status: data.status || 'submitted',
            at: data.created_at || new Date().toISOString(),
            message: data.status === 'completed' ? 'Intercambio completado.' : 'Pedido registrado. Esperando cola...',
          },
        ],
        statusLabel:
          data.status === 'completed'
            ? 'Intercambio completado.'
            : data.status === 'pending'
            ? 'Pedido recibido. En espera de bot...'
            : data.status,
        createdAt: data.created_at,
      };

      return NextResponse.json({ order });
    } catch (err: any) {
      console.error('[orders/status] Supabase fallback error:', err);
      return NextResponse.json({ error: err.message || 'Error de base de datos.' }, { status: 500 });
    }
  }

  return NextResponse.json({
    order: {
      id,
      game: 'sv',
      status: 'submitted',
      tradeCode: '00000000',
      isBulk: false,
      queuePosition: null,
      items: [],
      logs: [{ status: 'submitted', at: new Date().toISOString(), message: 'Pedido registrado.' }],
      statusLabel: 'Pedido registrado. Introduce el código cuando el bot esté listo.',
    },
  });
}
