import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Activity, Zap, Crown, Sparkles, Users, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dark Header Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-8 overflow-hidden">
        {/* Subtle glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pokemon-blue opacity-10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-winds-from opacity-10 blur-3xl rounded-full" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-3 text-gradient-pokemon uppercase tracking-tight">
                Dashboard
              </h1>
              <p className="text-white text-lg font-medium">
                Bienvenido, <span className="text-pokemon-yellow font-bold">{user.email}</span>
              </p>
            </div>
            <form action="/auth/signout" method="post">
              <button className="bg-white text-gray-900 font-bold px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 uppercase tracking-wide shadow-lg">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* White Stats Section */}
      <div className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">Estadísticas</h2>
          <p className="text-gray-600 mb-10 text-lg">Monitorea tu actividad en la plataforma</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Fire Theme */}
            <div className="border-fire bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-2 bg-fire" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-fire to-orange-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-gray-900">0</p>
                  </div>
                </div>
                <h3 className="text-xl font-black mb-2 text-fire uppercase">Total Inyecciones</h3>
                <p className="text-gray-600 text-sm font-medium">Próximamente disponible</p>
              </div>
            </div>

            {/* Card 2 - Water Theme */}
            <div className="border-water bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-2 bg-water" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-water to-blue-600 rounded-lg flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-water">GRATIS</p>
                  </div>
                </div>
                <h3 className="text-xl font-black mb-2 text-water uppercase">Suscripción</h3>
                <p className="text-gray-600 text-sm font-medium">Actualiza para más beneficios</p>
              </div>
            </div>

            {/* Card 3 - Grass Theme */}
            <div className="border-grass bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-2 bg-grass" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-grass to-green-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-gray-900">-</p>
                  </div>
                </div>
                <h3 className="text-xl font-black mb-2 text-grass uppercase">Posición en Cola</h3>
                <p className="text-gray-600 text-sm font-medium">Sin solicitudes activas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Features Section */}
      <div className="relative py-20 px-8 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 overflow-hidden">
        {/* Glow orb effect */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full" 
             style={{
               background: 'radial-gradient(circle, rgba(255,107,53,1) 0%, rgba(230,62,109,1) 33%, rgba(123,44,191,1) 66%, rgba(0,217,255,1) 100%)',
               filter: 'blur(40px)',
               opacity: 0.3
             }} 
        />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-electric uppercase tracking-tight">
              Próximamente
            </h2>
            <p className="text-white text-xl mb-8 leading-relaxed">
              El sistema de automatización de Pokémon está en desarrollo. Pronto podrás crear y distribuir Pokémon personalizados.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-5 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-pokemon-yellow" />
                  <span className="text-white font-bold text-lg">Team Builder</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-5 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-pokemon-yellow" />
                  <span className="text-white font-bold text-lg">Sistema de Colas</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-5 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-pokemon-yellow" />
                  <span className="text-white font-bold text-lg">Validación de Legalidad</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-5 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-pokemon-yellow" />
                  <span className="text-white font-bold text-lg">Planes Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Black */}
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-400 text-sm">
            Desarrollado con <span className="text-red-500">❤️</span> para la Comunidad Pokémon
          </p>
        </div>
      </div>
    </div>
  )
}
