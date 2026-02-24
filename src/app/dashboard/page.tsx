import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Zap, Crown, Activity, Users, TrendingUp, Sparkles, Settings } from 'lucide-react'
import Link from 'next/link'

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
      <div className="relative py-12 px-8 overflow-hidden">
        {/* FONDOLOGIN background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/FONDOLOGIN.png')" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        
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
          </div>
        </div>
      </div>

      {/* White Stats Section */}
      <div className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">Estadísticas</h2>
          <p className="text-gray-600 mb-10 text-lg">Monitorea tu actividad en la plataforma</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/" className="bg-white border-[3px] border-electric rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105 group">
              <div className="h-3 bg-electric" />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-linear-to-br from-electric to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Crea tu Pokémon</h3>
                </div>
                <p className="text-gray-600 font-medium mb-4">Construye tu equipo perfecto de Pokémon con nuestro editor interactivo</p>
                <div className="flex items-center gap-2 text-pokemon-blue font-bold group-hover:gap-3 transition-all">
                  <span>Empezar ahora</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            <div className="bg-white border-[3px] border-psychic rounded-xl overflow-hidden hover:shadow-2xl transition-all">
              <div className="h-3 bg-psychic" />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-linear-to-br from-psychic to-purple-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Intercambios</h3>
                </div>
                <p className="text-gray-600 font-medium">Próximamente: Recibe tus Pokémon personalizados en tu consola</p>
              </div>
            </div>

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
                <h3 className="text-xl text-gray-900 font-black mb-2 text-fire uppercase">Total Intercambios</h3>
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
                    <p className="text-3xl font-black text-green-400">GRATIS</p>
                  </div>
                </div>
                <h3 className="text-xl text-gray-900 font-black mb-2 text-water uppercase">Suscripción</h3>
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
                <h3 className="text-xl text-gray-900 font-black mb-2 text-grass uppercase">Posición en Cola</h3>
                <p className="text-gray-600 text-sm font-medium">Sin solicitudes activas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Features Section */}
      <div className="relative py-20 px-8 overflow-hidden">
        {/* FONDOLOGIN background - muestra la parte inferior (agua/fuego abajo) */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: "url('/FONDOLOGIN.png')" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-electric uppercase tracking-tight">
              Próximamente
            </h2>
            <p className="text-white text-xl mb-8 leading-relaxed">
              Estamos preparando nuevas funcionalidades. Pronto podrás personalizar y recibir tus Pokémon favoritos directamente en tu consola.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-5 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-pokemon-yellow" />
                  <span className="text-white font-bold text-lg">Crea tu Pokémon</span>
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
            PKDeX &mdash; Diseña y obtén tu Pokémon ideal
          </p>
        </div>
      </div>
    </div>
  )
}
