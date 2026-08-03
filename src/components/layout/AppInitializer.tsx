'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function AppInitializer() {
  const { initSupabase, setUser, clearUser, setTradesStats, supabase } = useAppStore();

  // Fetch Supabase configuration and initialize
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/config');
        if (res.ok) {
          const config = await res.json();
          if (config.supabaseUrl && config.supabaseAnonKey) {
            initSupabase(config.supabaseUrl, config.supabaseAnonKey);
          }
        }
      } catch (err) {
        console.error('Error fetching Supabase client configuration:', err);
      }
    }
    init();
  }, [initSupabase]);

  // Listen to Supabase auth changes
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        const localPlan = session.user.user_metadata?.plan || session.user.app_metadata?.plan || 'free';
        setUser(session.user, session.user.user_metadata, localPlan);

        // Fetch official dashboard stats & plan from backend
        try {
          const res = await fetch('/api/user/dashboard', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (res.ok) {
            const dashboard = await res.json();
            const plan = dashboard.user?.plan || localPlan;
            setUser(session.user, session.user.user_metadata, plan);
            setTradesStats(
              dashboard.stats?.tradesCompleted || 0,
              dashboard.stats?.remainingFreeTradesZA !== undefined ? dashboard.stats.remainingFreeTradesZA : 3,
              dashboard.stats?.remainingFreeTradesSV !== undefined ? dashboard.stats.remainingFreeTradesSV : 3
            );
          }
        } catch (err) {
          console.warn('Could not fetch server profile dashboard:', err);
        }
      } else {
        clearUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser, clearUser, setTradesStats]);

  // Lightweight page view analytics
  useEffect(() => {
    try {
      fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: window.location.pathname,
          referrer: document.referrer || null
        })
      }).catch(() => {}); // silently fail
    } catch {}
  }, []);

  return null;
}
