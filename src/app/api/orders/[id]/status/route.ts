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

  // If Supabase is available, fetch from DB
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

      // Build the trade-room order object from the DB row
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
      console.error('[orders/status] Supabase error:', err);
      return NextResponse.json({ error: err.message || 'Error de base de datos.' }, { status: 500 });
    }
  }

  // No Supabase: return a mock response so the trade-room page doesn't crash
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
