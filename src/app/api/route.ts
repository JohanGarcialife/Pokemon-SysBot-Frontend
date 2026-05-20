import { NextResponse } from 'next/server';
import { combinedMeta } from '@/lib/validation';

export async function GET() {
  return NextResponse.json({
    name: combinedMeta.name,
    endpoints: [
      '/api/meta',
      '/api/games',
      '/api/:game/items',
      '/api/:game/pokemon',
      '/api/:game/pokemon/:species/encounters?form=0',
      'POST /api/:game/validate',
      'POST /api/orders/single',
      'POST /api/orders/bulk'
    ]
  });
}
