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
import { WarningModal } from '@/components/frontpage/WarningModal';

export default function HomePage() {
  const { initSupabase, setUser, clearUser, setTradesStats } = useAppStore();
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [warningOrder, setWarningOrder] = useState<{ activeOrderId: string; message?: string } | null>(null);

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
        // Force refresh the session token so app_metadata.plan is always current
        // (Stripe webhook updates app_metadata server-side; local JWT may be stale)
        let freshSession = session;
        try {
          const { data: refreshed } = await supabase.auth.refreshSession();
          if (refreshed?.session) freshSession = refreshed.session;
        } catch (_) {
          // If refresh fails, continue with existing session
        }

        const localPlan = freshSession.user.user_metadata?.plan || freshSession.user.app_metadata?.plan || 'free';
        setUser(freshSession.user, freshSession.user.user_metadata, localPlan);
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
              'Authorization': `Bearer ${freshSession.access_token}`
            }
          });
          if (res.ok) {
            const dashboard = await res.json();
            const plan = dashboard.user?.plan || localPlan;
            setUser(freshSession.user, freshSession.user.user_metadata, plan);
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
        onShowWarning={(activeOrderId, message) => setWarningOrder({ activeOrderId, message })}
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
          onShowWarning={(activeOrderId, message) => setWarningOrder({ activeOrderId, message })}
        />
      )}

      {activeOrder && (
        <CodeModal 
          order={activeOrder} 
          onClose={() => setActiveOrder(null)} 
          onToast={triggerToast}
        />
      )}

      {warningOrder && (
        <WarningModal
          activeOrderId={warningOrder.activeOrderId}
          message={warningOrder.message}
          onClose={() => setWarningOrder(null)}
        />
      )}

      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} />
      )}

      <footer className="site-footer">
        <div className="site-footer-links">
          <a href="/legal/aviso-legal" className="site-footer-link">Aviso Legal</a>
          <a href="/legal/privacidad" className="site-footer-link">Privacidad</a>
          <a href="/legal/cookies" className="site-footer-link">Cookies</a>
          <a href="/legal/terminos" className="site-footer-link">Términos de Uso</a>
          <a href="/legal/reembolsos" className="site-footer-link">Reembolsos</a>
          <a href="/legal/contacto" className="site-footer-link">Contacto</a>
          <a href="/legal/uso-aceptable" className="site-footer-link">Uso Aceptable</a>
        </div>
        <p className="site-footer-copy">© {new Date().getFullYear()} PKDEX Trade. Todos los derechos reservados.</p>
      </footer>

      {toastMessage && (
        <div className="toast" style={{ display: 'block' }}>
          {toastMessage}
        </div>
      )}
    </>
  );
}
