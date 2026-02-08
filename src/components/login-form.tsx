'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Mail, Lock, AlertCircle, User } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  
  // Form States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  // UI States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState<string | null>(null)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden")
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: {
              username,
              first_name: firstName,
              last_name: lastName,
            },
          },
        })
        if (error) throw error
        setMessage('Revisa tu correo para confirmar tu cuenta.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (err: any) {
        setError(err.message)
        setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError(null)
    setMessage(null)
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="w-full max-w-md bg-white border-fire rounded-2xl shadow-2xl overflow-hidden">
      {/* Top color bar - Official Style */}
      <div className="h-2 bg-gradient-winds" />
      
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-black mb-3 text-gray-900 uppercase tracking-tight">
            {mode === 'signin' ? 'Bienvenido' : 'Únete'}
          </h2>
          <p className="text-gray-600 text-base font-medium">
            {mode === 'signin' 
              ? 'Accede a tu plataforma de automatización' 
              : 'Únete a la comunidad de entrenadores'}
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Login - White button with border */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-3 border-gray-900 text-gray-900 font-bold py-3.5 px-4 rounded-full hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg uppercase tracking-wide"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.424 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.424 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            Continuar con Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 py-1 text-gray-500 font-bold tracking-wide">O continúa con</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            
            {/* Sign Up Fields */}
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
                  />
                </div>
              </>
            )}

            {/* Common Fields */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
              />
            </div>

            {/* Confirm Password Field */}
            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 text-sm p-3 rounded-xl flex items-start gap-2 font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {message && (
               <div className="bg-green-50 border-2 border-green-300 text-green-700 text-sm p-3 rounded-xl font-medium">
                 <span>{message}</span>
               </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-waves text-white font-black py-4 px-4 rounded-full hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-wide text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'signin' ? 'Iniciar Sesión' : 'Registrarse')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6 font-medium">
            {mode === 'signin' ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
            <button
              onClick={toggleMode}
              className="text-pokemon-blue font-bold hover:underline"
            >
              {mode === 'signin' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
