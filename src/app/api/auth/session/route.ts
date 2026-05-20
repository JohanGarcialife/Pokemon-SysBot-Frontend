import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      plan: 'Gratis',
      note: 'Sin sesión activa o token inválido.'
    });
  }
  return NextResponse.json({
    authenticated: true,
    user: { id: user.id, email: user.email, plan: user.plan === 'premium' ? 'Premium' : 'Gratis' },
    plan: user.plan === 'premium' ? 'Premium' : 'Gratis',
    note: 'Sesión recuperada con éxito desde Supabase.'
  });
}
