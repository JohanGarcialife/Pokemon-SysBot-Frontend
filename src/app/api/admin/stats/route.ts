import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const res = await fetch(`${BACKEND}/api/admin/stats`, {
    headers: auth ? { Authorization: auth } : {},
  });
  
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
