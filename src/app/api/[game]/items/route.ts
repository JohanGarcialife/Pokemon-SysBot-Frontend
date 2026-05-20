import { NextRequest, NextResponse } from 'next/server';
import { itemLists } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: { game: string } }
) {
  const game = params.game?.toLowerCase();
  if (game !== 'za' && game !== 'sv') {
    return NextResponse.json({ error: 'Juego no soportado.' }, { status: 400 });
  }
  const items = itemLists[game] || ['Sin objeto'];
  return NextResponse.json({ game, items });
}
