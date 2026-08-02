import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const res = await fetch(`${BACKEND}/api/admin/stats`, {
    headers: auth ? { Authorization: auth } : {},
  });
  if (!res.ok) return NextResponse.json({ admin: false }, { status: 403 });
  return NextResponse.json({ admin: true });
}
