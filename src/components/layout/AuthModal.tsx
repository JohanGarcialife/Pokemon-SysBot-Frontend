'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { supabase } = useAppStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleAuthMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!supabase) {
      setErrorMsg('El servicio de autenticación no está listo.');
      return;
    }

    setSubmitting(true);
    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // The auth state change listener in layout/page will update the store
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              plan: selectedPlan,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          onClose();
        } else {
          setSuccessMsg('Registro exitoso. Revisa tu correo de confirmación o inicia sesión.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error en la autenticación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!supabase) {
      setErrorMsg('El servicio de autenticación no está listo.');
      return;
    }
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/` 
        : 'https://prueba-propia.onrender.com/';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión con Google.');
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <div className="modal-panel auth-panel">
        <button className="close" onClick={onClose} type="button" aria-label="Cerrar">×</button>
        
        <div className="auth-top">
          <span className="auth-icon">🔑</span>
          <div>
            <h2 id="authTitle">
              {authMode === 'login' ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
            </h2>
            <p id="authSubtitle">
              {authMode === 'login' 
                ? 'Accede a tu cuenta para crear tus Pokémon legales.' 
                : 'Crea una cuenta para empezar a fabricar Pokémon legales.'}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: '24px' }}>
          {errorMsg && (
            <div className="notice error" style={{ marginBottom: '12px', marginTop: 0 }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="notice ok" style={{ marginBottom: '12px', marginTop: 0 }}>
              {successMsg}
            </div>
          )}
          
          <div className="field">
            <label htmlFor="authEmail">Correo Electrónico</label>
            <input 
              id="authEmail" 
              className="input" 
              type="email" 
              required 
              placeholder="ejemplo@pkdex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="field" style={{ marginTop: '12px' }}>
            <label htmlFor="authPassword">Contraseña</label>
            <input 
              id="authPassword" 
              className="input" 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {authMode === 'register' && (
            <div className="field" id="planSelectContainer" style={{ marginTop: '12px' }}>
              <label>Plan de Suscripción (Demostración)</label>
              <div className="btnrow">
                <button 
                  className={`toggle ${selectedPlan === 'free' ? 'active' : ''}`}
                  type="button" 
                  onClick={() => setSelectedPlan('free')}
                >
                  Gratis
                </button>
                <button 
                  className={`toggle ${selectedPlan === 'premium' ? 'active' : ''}`}
                  type="button" 
                  onClick={() => setSelectedPlan('premium')}
                >
                  Premium 👑
                </button>
              </div>
            </div>
          )}
          
          <button 
            id="authSubmitBtn" 
            className="main-action auth-submit-btn" 
            type="submit" 
            style={{ marginTop: '20px', width: '100%' }}
            disabled={submitting}
          >
            {submitting 
              ? (authMode === 'login' ? 'INICIANDO...' : 'REGISTRANDO...') 
              : (authMode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA')}
          </button>
        </form>

        <div className="auth-oauth-container" style={{ padding: '0 24px 8px' }}>
          <div className="auth-divider">
            <span>ó continuar con</span>
          </div>
          <button 
            id="googleAuthBtn" 
            className="google-btn flex items-center justify-center gap-3 w-full h-[52px] bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-2xl text-white text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 ease-out shadow-lg hover:shadow-blue-500/10 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0" 
            type="button"
            onClick={handleGoogleAuth}
          >
            <svg className="google-icon flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Acceder con Google</span>
          </button>
        </div>
        
        <div className="auth-footer" style={{ textAlign: 'center', padding: '0 24px 24px', color: '#a8b4ca', fontWeight: 750 }}>
          <p id="authToggleText" style={{ margin: 0 }}>
            {authMode === 'login' ? (
              <>
                ¿No tienes una cuenta?{' '}
                <a href="#" onClick={toggleAuthMode} id="authToggleLink" style={{ color: 'var(--blue2)', textDecoration: 'underline' }}>
                  Regístrate gratis
                </a>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{' '}
                <a href="#" onClick={toggleAuthMode} id="authToggleLink" style={{ color: 'var(--blue2)', textDecoration: 'underline' }}>
                  Inicia sesión aquí
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
