import { NextRequest, NextResponse } from 'next/server';
import { loadEncounters, options, versionAllowed } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: { game: string; species: string } }
) {
  const gameId = params.game?.toLowerCase();
  const species = Number(params.species);
  
  if (gameId !== 'za' && gameId !== 'sv') {
    return NextResponse.json({ error: 'Juego no soportado.' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const form = Number(searchParams.get('form') || 0);
  const version = searchParams.get('version') || '';

  let list = loadEncounters(gameId, species, form);
  if (version) {
    list = list.filter(e => versionAllowed(e, version));
  }

  return NextResponse.json({
    game: gameId,
    species,
    form,
    count: list.length,
    results: list.map(e => options(gameId, e))
  });
}
