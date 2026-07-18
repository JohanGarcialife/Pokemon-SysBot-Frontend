'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';

interface SiteNavProps {
  onOpenAuth: () => void;
}

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free: 'Gratis',
  gym: 'Líder de Gimnasio',
  elite: 'Alto Mando',
  champion: 'Campeón de Liga',
  premium: 'Premium'
};

export function SiteNav({ onOpenAuth }: SiteNavProps) {
  const { user, profile, plan, clearUser, supabase } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const name = profile?.name || profile?.full_name || user?.email || 'Iniciar Sesión';
  const avatarUrl = profile?.picture || profile?.avatar_url;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePillClick = () => {
    if (user) {
      setDropdownOpen(!dropdownOpen);
    } else {
      onOpenAuth();
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert(`Error al cerrar sesión: ${error.message}`);
      } else {
        clearUser();
        setDropdownOpen(false);
      }
    } else {
      clearUser();
      setDropdownOpen(false);
    }
  };

  const displayPlan = PLAN_DISPLAY_NAMES[plan.toLowerCase()] || plan;

  return (
    <header className="site-nav">
      <a className="brand" href="/" aria-label="PKDEX inicio">
        <img src="/assets/pkdex-logo.png" alt="PKDEX" />
      </a>

      <nav className="nav-links" aria-label="Navegación principal">
        <a href="/dashboard" className={`nav-link ${pathname.startsWith('/dashboard') ? 'active' : ''}`}>▦ Dashboard</a>
        <a href="/#creator" className={`nav-link ${pathname === '/' && !pathname.startsWith('/dashboard') ? 'active' : ''}`}>🎮 Crea tu Pokémon</a>
        <a href="/memberships.html" className="nav-link">👑 Membresías</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/memberships.html" className="nav-link-mobile">
          👑 Membresías
        </a>

        <div className="user-pill-container" ref={dropdownRef}>
          <button 
            className="user-pill" 
            onClick={handlePillClick}
            type="button" 
            aria-haspopup="true" 
            aria-expanded={dropdownOpen}
          >
            <span className="mail">{user ? name : 'Iniciar Sesión'}</span>
            <span className="avatar">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                user ? (name.charAt(0).toUpperCase() || '👤') : '👤'
              )}
            </span>
          </button>

          {dropdownOpen && user && (
            <div className="user-dropdown" style={{ display: 'block' }}>
              <div className="dropdown-header">
                <span className="dropdown-user-email">{user.email || 'invitado@pkdex'}</span>
                <strong>PLAN: {displayPlan.toUpperCase()}</strong>
              </div>
              <a 
                href="/dashboard" 
                className="dropdown-item" 
                style={{ textDecoration: 'none', display: 'block', padding: '10px 14px', textAlign: 'left', fontWeight: 'bold' }}
              >
                📋 Mi Historial
              </a>
              <button 
                onClick={handleLogout} 
                className="dropdown-item" 
                type="button"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
