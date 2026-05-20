import { NextResponse } from 'next/server';
import { games } from '@/lib/validation';

export async function GET() {
  return NextResponse.json({
    results: Object.values(games).map(g => ({
      id: g.id,
      label: g.label,
      summary: g.summary,
      counts: g.meta.counts
    }))
  });
}
