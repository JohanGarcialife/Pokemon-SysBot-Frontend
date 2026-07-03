import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader, supabase } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Inicia sesión para cambiar tu plan.' }, { status: 401 });
  }

  try {
    const { plan } = await req.json();

    const ALLOWED_PLANS = ['free', 'gym', 'elite', 'champion', 'premium'];
    if (!plan || !ALLOWED_PLANS.includes(String(plan).toLowerCase())) {
      return NextResponse.json({ error: 'Plan inválido.' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado en el servidor.' }, { status: 500 });
    }

    console.log(`[test-change-plan] Updating user ${user.id} to plan: ${plan}`);

    // Update user app_metadata via Supabase Admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: {
        plan: plan.toLowerCase(),
        plan_updated_at: new Date().toISOString(),
      },
    });

    if (updateError) {
      console.error(`[test-change-plan] Failed to update user ${user.id} plan:`, updateError.message);
      return NextResponse.json({ error: 'No se pudo actualizar el plan.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Plan cambiado a ${plan} correctamente.`,
      plan: plan.toLowerCase()
    });
  } catch (err: any) {
    console.error('[test-change-plan] Handler error:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor.' }, { status: 500 });
  }
}
