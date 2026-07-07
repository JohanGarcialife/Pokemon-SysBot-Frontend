'use client';

import { useState, useEffect } from 'react';
import { SiteNav } from '@/components/layout/SiteNav';
import { Hero } from '@/components/frontpage/Hero';
import { DashboardCards } from '@/components/frontpage/DashboardCards';
import { CreatorSection } from '@/components/frontpage/CreatorSection';
import { PokemonModal } from '@/components/frontpage/PokemonModal';
import { CodeModal } from '@/components/frontpage/CodeModal';
import { AuthModal } from '@/components/layout/AuthModal';
import { WarningModal } from '@/components/frontpage/WarningModal';

export default function HomePage() {
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [warningOrder, setWarningOrder] = useState<{ activeOrderId: string; message?: string } | null>(null);

  // Check for cloned Pokémon from dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clone = localStorage.getItem('pkdex.clone_pokemon');
      if (clone) {
        try {
          const parsed = JSON.parse(clone);
          setSelectedPokemon(parsed);
        } catch (e) {
          console.error('Error parsing cloned pokemon:', e);
        } finally {
          localStorage.removeItem('pkdex.clone_pokemon');
        }
      }
    }
  }, []);

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
