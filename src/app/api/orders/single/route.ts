import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/lib/supabaseServer';
import { createSingleOrder } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para realizar un intercambio.' }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    const orderPayload = body.order || body;
    const result = await createSingleOrder(orderPayload, user);
    return NextResponse.json(result, { status: result.ok === false ? 400 : 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
