'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SiteNav } from '@/components/layout/SiteNav';
import { PokemonImage } from '@/components/frontpage/PokemonImage';

interface PokemonPayload {
  species: string | number;
  dexId?: number;
  displayName?: string;
  form?: number;
  level?: number;
  shiny?: boolean;
  ball?: string;
  heldItem?: string;
  gender?: string;
  nature?: string;
  evMode?: 'none' | 'max';
  teraType?: string;
  encounterId?: string;
  gameVersion?: string;
}

interface OrderItem {
  id: string;
  trade_code: string;
  status: string;
  game_version: string;
  team_payload?: PokemonPayload[];
  created_at: string;
  updated_at: string;
}

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free: 'Gratis',
  gym: 'Líder de Gimnasio',
  elite: 'Alto Mando',
  champion: 'Campeón de Liga',
  premium: 'Premium'
};

const STATUS_BADGES: Record<string, { label: string; class: string }> = {
  pending: { label: 'En Cola', class: 'status-pending' },
  searching: { label: 'Buscando', class: 'status-searching' },
  trading: { label: 'Intercambiando', class: 'status-trading' },
  completed: { label: 'Completado', class: 'status-completed' },
  failed: { label: 'Fallido', class: 'status-failed' },
  expired: { label: 'Expirado', class: 'status-failed' },
  cancelled: { label: 'Cancelado', class: 'status-failed' }
};

export default function DashboardPage() {
  const { user, plan, supabase, setGame, setUser } = useAppStore();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [authOpen, setAuthOpen] = useState(false);

  // Profile Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Stripe Portal states
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');

  const FINAL_STATUSES = ['completed', 'failed', 'expired', 'cancelled', 'partial_failed'];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchHistory() {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setErrorMsg('Sesión expirada. Por favor, inicia sesión de nuevo.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(data.error || 'Error al cargar el historial.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();

    // Auto-refresh every 5s while there are active (non-final) orders
    const interval = setInterval(async () => {
      const hasActive = orders.some(o => !FINAL_STATUSES.includes(o.status));
      if (hasActive) {
        await fetchHistory();
      }
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, supabase]);


  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    try {
      setSavingProfile(true);
      setProfileError('');
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: newName.trim(),
          picture: newAvatarUrl.trim() || null
        }
      });

      if (error) throw error;
      
      // Update app store locally with new user metadata
      setUser(data.user, data.user.user_metadata, plan);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setProfileError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenPortal = async () => {
    if (!supabase || !user) return;
    try {
      setPortalLoading(true);
      setPortalError('');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setPortalError('Debes volver a iniciar sesión.');
        return;
      }

      const res = await fetch('/api/payments/customer-portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al generar enlace del portal.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la dirección del portal.');
      }
    } catch (err: any) {
      console.error(err);
      setPortalError(err.message || 'Error al abrir el portal de facturación.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleClone = (pokemon: PokemonPayload, order: OrderItem) => {
    // Determine target game: Legends ZA -> 'za', Scarlet/Violet -> 'sv'
    const targetGame = order.game_version === 'legends-za' ? 'za' : 'sv';
    
    // Construct the clone request payload
    const clonePokemon = {
      species: pokemon.dexId || (typeof pokemon.species === 'number' ? pokemon.species : 1),
      form: pokemon.form || 0,
      displayName: pokemon.displayName || String(pokemon.species),
      isClone: true,
      clonedData: {
        ...pokemon,
        gameVersion: pokemon.gameVersion || (order.game_version === 'legends-za' ? 'legends-za' : 'scarlet')
      }
    };

    // Save clone metadata in localStorage
    localStorage.setItem('pkdex.clone_pokemon', JSON.stringify(clonePokemon));
    
    // Update active game store
    setGame(targetGame);
    
    // Redirect to home page teambuilder
    window.location.assign('/#creator');
  };

  const getGameLabel = (version: string) => {
    if (version === 'legends-za') return 'Leyendas Z-A';
    return 'Escarlata / Púrpura';
  };

  const getGameClass = (version: string) => {
    if (version === 'legends-za') return 'game-badge-za';
    return 'game-badge-sv';
  };

  if (!user) {
    return (
      <>
        <SiteNav onOpenAuth={() => setAuthOpen(true)} />
        <main className="creator-shell" style={{ marginTop: '80px', display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
          <section className="creator-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '14px', fontWeight: 1000 }}>📋 Tu Historial</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '24px', fontWeight: 650 }}>
              Debes iniciar sesión para ver tu historial de intercambios y clonar tus Pokémon creados.
            </p>
            <button 
              onClick={() => window.location.assign('/?login=true')} 
              className="main-action" 
              style={{ width: '100%' }}
            >
              Iniciar Sesión
            </button>
          </section>
        </main>
      </>
    );
  }

  const displayPlan = PLAN_DISPLAY_NAMES[plan.toLowerCase()] || plan;

  return (
    <>
      <SiteNav onOpenAuth={() => {}} />

      <main className="creator-shell" style={{ marginTop: '40px' }}>
        <div className="dashboard-grid-container" style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.8fr', gap: '24px' }}>
          
          {/* Historial de Pedidos */}
          <section className="dashboard-main-section">
            <h1 style={{ fontSize: '32px', marginBottom: '24px', fontWeight: 1000 }}>📋 Historial de Intercambios</h1>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontWeight: 800 }}>
                Cargando historial de pedidos...
              </div>
            ) : errorMsg ? (
              <div className="notice error" style={{ padding: '18px', borderRadius: '16px' }}>
                {errorMsg}
              </div>
            ) : orders.length === 0 ? (
              <div className="creator-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👾</div>
                <h3 style={{ fontSize: '22px', fontWeight: 1000, margin: '0 0 10px' }}>Sin intercambios</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                  Aún no has creado ningún Pokémon en la plataforma. ¡Comienza a diseñar tu primer equipo ahora!
                </p>
                <a href="/" className="main-action" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 32px' }}>
                  Crear Pokémon →
                </a>
              </div>
            ) : (
              <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map((order) => {
                  const badge = STATUS_BADGES[order.status] || { label: order.status, class: 'status-pending' };
                  return (
                    <article 
                      key={order.id} 
                      className="creator-card" 
                      style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(16,26,49,0.9), rgba(8,14,28,0.9))' }}
                    >
                      {/* Order Header */}
                      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 800 }}>PEDIDO #{order.id.slice(0, 8).toUpperCase()}</span>
                          <span style={{ margin: '0 8px', color: 'var(--line)' }}>•</span>
                          <span style={{ fontSize: '13px', color: 'var(--soft)', fontWeight: 700 }}>
                            {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span className={`game-badge ${getGameClass(order.game_version)}`} style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
                            {getGameLabel(order.game_version)}
                          </span>
                          <span className={`status-pill ${badge.class}`} style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 900 }}>
                            {badge.label.toUpperCase()}
                          </span>
                        </div>
                      </header>

                      {/* Trade details */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--line)' }}>
                        <span style={{ fontWeight: 800, color: 'var(--soft)' }}>Código de Intercambio:</span>
                        <strong style={{ letterSpacing: '0.05em', color: 'var(--yellow)' }}>{order.trade_code}</strong>
                      </div>

                      {/* Team Pokémon */}
                      <div className="order-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {order.team_payload && order.team_payload.map((pokemon, idx) => {
                          const speciesId = pokemon.dexId || (typeof pokemon.species === 'number' ? pokemon.species : 1);
                          return (
                            <div 
                              key={idx} 
                              className="panel-box" 
                              style={{ display: 'flex', gap: '14px', alignItems: 'center', margin: 0, padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', borderRadius: '16px' }}
                            >
                              <div style={{ position: 'relative', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', width: '74px', height: '74px', display: 'grid', placeItems: 'center' }}>
                                <PokemonImage 
                                  species={speciesId} 
                                  form={pokemon.form || 0} 
                                  alt={pokemon.displayName || 'Pokémon'}
                                  style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                />
                                {pokemon.shiny && (
                                  <span style={{ position: 'absolute', right: '4px', bottom: '4px', fontSize: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>✨</span>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 1000, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {pokemon.displayName || 'Pokémon'}
                                </h4>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '2px', fontWeight: 700 }}>
                                  <span>Nivel: {pokemon.level || 50} • Nat: {pokemon.nature || 'Random'}</span>
                                  <span style={{ color: 'var(--soft)' }}>Teratipo: {pokemon.teraType || 'Normal'}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleClone(pokemon, order)}
                                className="toggle active" 
                                style={{ width: 'auto', padding: '10px 14px', fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '10px' }}
                                type="button"
                              >
                                📋 Clonar
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Tarjeta de Perfil y Suscripción */}
          <section className="dashboard-sidebar-section" style={{ position: 'sticky', top: '94px', height: 'fit-content' }}>
            <div className="creator-card" style={{ padding: '24px', borderTop: '5px solid var(--blue)' }}>
              
              {/* Profile Display / Edit */}
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', color: 'white', display: 'grid', placeItems: 'center', fontSize: '32px', margin: '0 auto 12px', fontWeight: 1000, overflow: 'hidden' }}>
                  {user.user_metadata?.picture || user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata?.picture || user.user_metadata?.avatar_url} 
                      alt="Avatar" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    (user.user_metadata?.name || user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase() || '👤'
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} style={{ textAlign: 'left', marginTop: '12px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--muted)', marginBottom: '4px' }}>NOMBRE</label>
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        className="input" 
                        style={{ width: '100%', height: '38px', borderRadius: '8px', fontSize: '14px', background: '#09101f', border: '1px solid var(--line)', padding: '0 10px', color: 'white' }} 
                        placeholder="Tu nombre o apodo"
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--muted)', marginBottom: '4px' }}>FOTO DE PERFIL (URL)</label>
                      <input 
                        type="url" 
                        value={newAvatarUrl} 
                        onChange={(e) => setNewAvatarUrl(e.target.value)} 
                        className="input" 
                        style={{ width: '100%', height: '38px', borderRadius: '8px', fontSize: '14px', background: '#09101f', border: '1px solid var(--line)', padding: '0 10px', color: 'white' }} 
                        placeholder="https://ejemplo.com/foto.jpg"
                      />
                    </div>
                    {profileError && <p style={{ color: 'var(--danger)', fontSize: '12px', margin: '0 0 10px', fontWeight: 'bold' }}>{profileError}</p>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        type="submit" 
                        className="toggle active" 
                        style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '8px', border: 0 }}
                        disabled={savingProfile}
                      >
                        {savingProfile ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button 
                        type="button" 
                        className="toggle" 
                        style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--line)' }}
                        onClick={() => { setIsEditing(false); setProfileError(''); }}
                        disabled={savingProfile}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 style={{ fontSize: '18px', fontWeight: 1000, margin: 0 }}>
                      {user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Entrenador PKDEX'}
                    </h3>
                    <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 650, display: 'block', wordBreak: 'break-all', marginTop: '2px' }}>
                      {user.email}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => {
                        setNewName(user.user_metadata?.name || user.user_metadata?.full_name || '');
                        setNewAvatarUrl(user.user_metadata?.picture || user.user_metadata?.avatar_url || '');
                        setIsEditing(true);
                      }}
                      className="toggle" 
                      style={{ display: 'inline-block', width: 'auto', padding: '6px 14px', fontSize: '11px', marginTop: '12px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    >
                      ✏️ Editar perfil
                    </button>
                  </>
                )}
              </div>

              {/* Suscripción */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '18px' }}>
                <span className="dash-label">Plan de Suscripción</span>
                <strong style={{ display: 'block', fontSize: '24px', margin: '6px 0 10px', color: plan !== 'free' ? 'var(--yellow)' : 'var(--green)', fontWeight: 1000 }}>
                  {displayPlan.toUpperCase()}
                </strong>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.4, margin: '0 0 16px', fontWeight: 650 }}>
                  {plan !== 'free'
                    ? '¡Tu cuenta premium está activa! Disfrutas de pedidos masivos de 3 slots y acceso ilimitado a eventos.'
                    : 'Actualmente estás en el plan básico gratuito. Tienes un límite de 3 intercambios diarios.'}
                </p>
                <a href="/memberships.html" className="secondary-action" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: '13px' }}>
                  {plan !== 'free' ? 'Ver detalles de plan' : 'Mejorar membresía 👑'}
                </a>

                {/* Enlace discreto para gestionar / cancelar Stripe */}
                {plan !== 'free' && (
                  <div style={{ marginTop: '14px', textAlign: 'center' }}>
                    <button 
                      onClick={handleOpenPortal}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', fontWeight: 650, display: 'inline-block' }}
                      type="button"
                      disabled={portalLoading}
                    >
                      {portalLoading ? 'Abriendo portal...' : 'Gestionar suscripción'}
                    </button>
                    {portalError && <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', fontWeight: 'bold' }}>{portalError}</p>}
                  </div>
                )}
              </div>

            </div>
          </section>

        </div>
      </main>

      <style jsx global>{`
        .game-badge-za {
          background: rgba(255, 210, 31, 0.15) !important;
          color: var(--yellow) !important;
          border: 1px solid rgba(255, 210, 31, 0.3);
        }
        .game-badge-sv {
          background: rgba(56, 189, 248, 0.15) !important;
          color: var(--blue2) !important;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .status-pending {
          background: rgba(159, 176, 202, 0.15) !important;
          color: var(--muted) !important;
          border: 1px solid rgba(159, 176, 202, 0.3);
        }
        .status-searching {
          background: rgba(60, 120, 255, 0.15) !important;
          color: var(--blue) !important;
          border: 1px solid rgba(60, 120, 255, 0.3);
        }
        .status-trading {
          background: rgba(139, 92, 246, 0.15) !important;
          color: var(--purple) !important;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        .status-completed {
          background: rgba(48, 229, 127, 0.15) !important;
          color: var(--green) !important;
          border: 1px solid rgba(48, 229, 127, 0.3);
        }
        .status-failed {
          background: rgba(255, 91, 110, 0.15) !important;
          color: var(--danger) !important;
          border: 1px solid rgba(255, 91, 110, 0.3);
        }
        @media (max-width: 960px) {
          .dashboard-grid-container {
            grid-template-columns: 1fr !important;
          }
          .dashboard-sidebar-section {
            position: static !important;
          }
        }
      `}</style>
    </>
  );
}
