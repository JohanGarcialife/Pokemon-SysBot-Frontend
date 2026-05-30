'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PokemonImage } from './PokemonImage';

interface BulkOrderSectionProps {
  onOpenAuth: () => void;
  onOrderCreated: (order: any) => void;
}

const gameLabels: Record<string, string> = {
  za: 'Legends: Z-A',
  sv: 'Scarlet / Violet',
};

export function BulkOrderSection({ onOpenAuth, onOrderCreated }: BulkOrderSectionProps) {
  const { user, isPremium, plan, bulk, removeFromBulk, clearBulk, supabase } = useAppStore();
  const [submitting, setSubmitting] = useState(false);

  const maxSlots = 3;

  const handleSubmit = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!isPremium) {
      alert('El pedido masivo es una función Premium.');
      return;
    }
    if (!bulk.length) {
      alert('Añade al menos 1 Pokémon.');
      return;
    }

    setSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase no inicializado');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Inicia sesión para realizar pedidos masivos.');

      const res = await fetch('/api/orders/bulk', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ orders: bulk }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar pedido masivo');
      }

      // Successful order
      onOrderCreated(data);
      clearBulk();
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const slots = [];
  for (let i = 0; i < maxSlots; i++) {
    const order = bulk[i];
    slots.push(order);
  }

  return (
    <section className="bulk-section" id="bulkSection">
      <div className="bulk-head">
        <div>
          <span className="step-badge">3</span>
          <strong>TU PEDIDO MASIVO</strong>
          <p>
            <span>{bulk.length}</span> / 3 Pokémon — solo dentro del mismo juego.
          </p>
        </div>
        <span 
          className="premium-lock" 
          id="premiumLock"
          style={{ cursor: !user ? 'pointer' : 'default' }}
          onClick={() => { if (!user) onOpenAuth(); }}
        >
          {user ? (isPremium ? `Plan: ${plan.toUpperCase()}` : '🔒 Premium') : '🔒 Premium'}
        </span>
      </div>

      <div className="bulk-slots" id="bulkSlots">
        {slots.map((order, i) => {
          if (order) {
            return (
              <div key={i} className="slot filled">
                <button 
                  type="button" 
                  aria-label="Eliminar"
                  onClick={() => removeFromBulk(i)}
                >
                  ×
                </button>
                <PokemonImage 
                  species={order.species} 
                  form={order.form} 
                  alt={order.displayName} 
                />
                <strong>{order.displayName}</strong>
                <small>
                  {gameLabels[order.game]} · Nv. {order.level}
                  {order.shiny ? ' · Shiny' : ''}
                </small>
              </div>
            );
          } else {
            return (
              <div key={i} className="slot">
                <div>
                  <b>?</b>
                  <small>Slot {i + 1}</small>
                </div>
              </div>
            );
          }
        })}
      </div>

      <button 
        id="bulkSubmit" 
        className={`bulk-submit ${isPremium && bulk.length > 0 ? 'enabled' : ''}`}
        type="button" 
        onClick={handleSubmit}
        disabled={submitting || !isPremium || bulk.length === 0}
      >
        {submitting ? 'GENERANDO PEDIDO...' : '↔ SOLICITAR PEDIDO MASIVO'}
      </button>
      
      <p className="bulk-note">
        Preparado para que tu programador active planes de pago y conecte el bot de intercambio. Máximo 3 Pokémon por estabilidad del bot.
      </p>
    </section>
  );
}
