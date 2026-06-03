import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: { game: string } }
) {
  const gameId = params.game?.toLowerCase();
  const g = games[gameId];
  if (!g) {
    return NextResponse.json({ error: 'Juego no soportado.' }, { status: 400 });
  }
  return NextResponse.json({
    summary: g.summary,
    ...g.meta
  });
}
