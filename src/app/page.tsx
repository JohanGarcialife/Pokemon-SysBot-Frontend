'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SiteNav } from '@/components/layout/SiteNav';
import { Hero } from '@/components/frontpage/Hero';
import { DashboardCards } from '@/components/frontpage/DashboardCards';
import { CreatorSection } from '@/components/frontpage/CreatorSection';
import { PokemonModal } from '@/components/frontpage/PokemonModal';
import { CodeModal } from '@/components/frontpage/CodeModal';
import { AuthModal } from '@/components/layout/AuthModal';

export default function HomePage() {
  const { initSupabase, setUser, clearUser } = useAppStore();
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
  const { supabase } = useAppStore();
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        const localPlan = session.user.user_metadata?.plan || session.user.app_metadata?.plan || 'free';
        setUser(session.user, session.user.user_metadata, localPlan);
        setAuthOpen(false);

        if (event === 'SIGNED_IN' && typeof window !== 'undefined') {
          if (window.location.hash.includes('access_token')) {
            window.location.hash = 'creator';
          }
        }

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
  }, [supabase, setUser, clearUser]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  return (
    <>
      <SiteNav onOpenAuth={() => setAuthOpen(true)} />
      <Hero />
      <DashboardCards />
      
      <CreatorSection 
        onSelectPokemon={(p) => setSelectedPokemon(p)} 
        onOpenAuth={() => setAuthOpen(true)}
        onOrderCreated={(order) => {
          triggerToast(order.isBulk ? '¡Pedido masivo creado con éxito! Redirigiendo a la sala...' : '¡Pedido creado con éxito! Redirigiendo a la sala...');
          setTimeout(() => {
            window.location.assign(`/trade-room.html?order=${order.id}`);
          }, 1000);
        }}
      />

      {selectedPokemon && (
        <PokemonModal 
          pokemon={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)}
          onOpenAuth={() => setAuthOpen(true)}
          onOrderCreated={(order) => {
            setSelectedPokemon(null);
            triggerToast(order.isBulk ? '¡Pedido masivo creado con éxito! Redirigiendo a la sala...' : '¡Pedido creado con éxito! Redirigiendo a la sala...');
            setTimeout(() => {
              window.location.assign(`/trade-room.html?order=${order.id}`);
            }, 1000);
          }}
          onToast={triggerToast}
        />
      )}

      {activeOrder && (
        <CodeModal 
          order={activeOrder} 
          onClose={() => setActiveOrder(null)} 
          onToast={triggerToast}
        />
      )}

      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} />
      )}

      {toastMessage && (
        <div className="toast" style={{ display: 'block' }}>
          {toastMessage}
        </div>
      )}
    </>
  );
}
