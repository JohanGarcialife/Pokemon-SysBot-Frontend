import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/lib/supabaseServer';
import { createBulkOrder } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para realizar pedidos masivos.' }, { status: 401 });
  }
  if (user.plan !== 'premium') {
    return NextResponse.json({ error: 'El pedido masivo es una función premium. Actualiza tu suscripción.' }, { status: 403 });
  }
  
  try {
    const body = await req.json();
    const orders = body.orders || [];
    const result = await createBulkOrder(orders, user);
    return NextResponse.json(result, { status: result.ok === false ? 400 : 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
