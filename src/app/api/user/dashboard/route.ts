import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader, supabase } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Autenticación requerida para ver el dashboard.' }, { status: 401 });
  }

  let tradesCompleted = 0;
  let remainingFreeTradesZA = 3;
  let remainingFreeTradesSV = 3;

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

      // Count active orders created today
      const startOfToday = new Date();
      startOfToday.setUTCHours(0,0,0,0);

      const { data: activeOrdersToday } = await supabase
        .from('orders')
        .select('game_version, status')
        .eq('user_id', user.id)
        .gte('created_at', startOfToday.toISOString())
        .not('status', 'in', '("failed","expired","cancelled")');

      const usedZA = (activeOrdersToday || []).filter((o: any) => o.game_version === 'legends-za').length;
      const usedSV = (activeOrdersToday || []).filter((o: any) => o.game_version === 'scarlet' || o.game_version === 'violet').length;

      remainingFreeTradesZA = Math.max(0, 3 - usedZA);
      remainingFreeTradesSV = Math.max(0, 3 - usedSV);
    } catch (err: any) {
      console.error('[Dashboard] Exception fetching dashboard stats:', err);
    }
  }

  return NextResponse.json({
    user: { email: user.email, plan: user.planTier || user.plan, role: user.planTier || user.plan },
    stats: { 
      tradesCompleted, 
      bulkOrdersEnabled: user.plan === 'premium', 
      bulkLimit: 3,
      remainingFreeTradesZA,
      remainingFreeTradesSV,
    },
    cta: { label: 'Crear tu Pokémon', href: '#creator' }
  });
}
