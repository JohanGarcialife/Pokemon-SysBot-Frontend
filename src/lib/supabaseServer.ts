import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase URL or Keys are missing in env!');
}

export const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })
  : null;

export interface AuthenticatedUser {
  id: string;
  email: string;
  plan: 'free' | 'premium';
}

export async function getUserFromHeader(authHeader: string | null | undefined): Promise<AuthenticatedUser | null> {
  if (!supabase) return null;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    const isPremium = user.app_metadata?.plan === 'premium' || user.user_metadata?.plan === 'premium';
    return {
      id: user.id,
      email: user.email ?? '',
      plan: isPremium ? 'premium' : 'free'
    };
  } catch (err: any) {
    console.error('[auth] Error al decodificar token de Supabase:', err.message);
    return null;
  }
}
