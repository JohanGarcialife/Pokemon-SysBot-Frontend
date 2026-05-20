import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader, supabase } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Autenticación requerida para ver el dashboard.' }, { status: 401 });
  }

  let tradesCompleted = 0;
  if (supabase) {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (!error && count !== null) {
        tradesCompleted = count;
      } else if (error) {
        console.error('[Dashboard] Error fetching order count:', error.message);
      }
    } catch (err: any) {
      console.error('[Dashboard] Exception fetching order count:', err);
    }
  }

  return NextResponse.json({
    user: { email: user.email, plan: user.plan === 'premium' ? 'Premium' : 'Gratis', role: user.plan },
    stats: { 
      tradesCompleted, 
      bulkOrdersEnabled: user.plan === 'premium', 
      bulkLimit: 3 
    },
    cta: { label: 'Crear tu Pokémon', href: '#creator' }
  });
}
