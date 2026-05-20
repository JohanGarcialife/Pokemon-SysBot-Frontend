'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function DashboardCards() {
  const { user, plan, isPremium, supabase } = useAppStore();
  const [tradesCompleted, setTradesCompleted] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      setTradesCompleted(0);
      return;
    }

    async function fetchStats() {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch('/api/user/dashboard', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTradesCompleted(data.stats?.tradesCompleted || 0);
        }
      } catch (err) {
        console.warn('Error fetching dashboard stats:', err);
      }
    }

    fetchStats();
  }, [user, supabase]);

  return (
    <section id="dashboard" className="dashboard-section">
      <div className="dashboard-card primary-dash">
        <div className="dash-icon">👥</div>
        <div>
          <h2>CREA TU POKÉMON</h2>
          <p>Construye tu equipo perfecto con nuestro editor legal conectado a ZA y SV.</p>
          <a href="#creator" className="dash-cta">Empezar ahora →</a>
        </div>
      </div>

      <div className="dashboard-card stat-dash">
        <span className="dash-label">Suscripción</span>
        <strong 
          id="planLabel" 
          style={{ color: isPremium ? 'var(--yellow)' : 'var(--green)' }}
        >
          {user ? plan.toUpperCase() : 'INVITADO'}
        </strong>
        <p>
          {isPremium 
            ? '¡Gracias por apoyar a PKDEX! Disfruta de tus ventajas.' 
            : 'Actualiza para desbloquear pedido masivo y más beneficios.'}
        </p>
      </div>

      <div className="dashboard-card stat-dash">
        <span className="dash-label">Intercambios</span>
        <strong id="tradeCountLabel">{user ? tradesCompleted : '0'}</strong>
        <p>Intercambios completados en tu cuenta de PKDEX.</p>
      </div>
    </section>
  );
}
