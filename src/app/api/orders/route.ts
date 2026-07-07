import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para ver tu historial.' }, { status: 401 });
  }

  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const backendUrl = rawUrl.replace(/\\n/g, '').replace(/\n/g, '').trim();

  try {
    const res = await fetch(`${backendUrl}/api/orders`, {
      headers: {
        'Authorization': authHeader || '',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: errData.error || 'Failed to fetch history' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Next.js orders GET] Error proxying history:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
