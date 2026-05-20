import { NextRequest, NextResponse } from 'next/server';
import { validate } from '@/lib/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: { game: string } }
) {
  const gameId = params.game?.toLowerCase();
  if (gameId !== 'za' && gameId !== 'sv') {
    return NextResponse.json({ error: 'Juego no soportado.' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const result = validate(gameId, body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
