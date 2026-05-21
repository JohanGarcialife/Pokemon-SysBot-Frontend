import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/lib/validation';

function sanitizePokemonForClient(p: any) {
  const homeWords = ['home', 'pokémon home', 'pokemon home', 'transferencia pokémon home', 'transferencia pokemon home'];
  const methods = Array.isArray(p.methods)
    ? p.methods.filter((m: any) => !homeWords.some(w => String(m || '').toLowerCase().includes(w)))
    : p.methods;
  return { ...p, methods };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { game: string } }
) {
  const gameId = params.game?.toLowerCase();
  const g = games[gameId];
  if (!g) {
    return NextResponse.json({ error: 'Juego no soportado.' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const method = (searchParams.get('method') || '').toLowerCase().trim();

  let list = g.pokemon;
  if (q) {
    list = list.filter((p: any) =>
      String(p.species) === q ||
      [p.displayName, p.displayNameEn, p.name, p.nameEn, p.formLabel, ...(p.searchAliases || [])]
        .some(v => String(v || '').toLowerCase().includes(q))
    );
  }
  if (method) {
    list = list.filter((p: any) =>
      (p.methods || []).some((x: any) => String(x).toLowerCase() === method)
    );
  }

  return NextResponse.json({ count: list.length, results: list.map(sanitizePokemonForClient) });
}
