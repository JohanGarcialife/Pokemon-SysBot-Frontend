import { NextResponse } from 'next/server';
import { combinedMeta } from '@/lib/validation';

export async function GET() {
  return NextResponse.json(combinedMeta);
}
