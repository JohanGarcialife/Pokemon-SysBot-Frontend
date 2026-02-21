import Link from 'next/link'
import Image from 'next/image'
import { Zap, Shield, Sparkles, Search, Sliders, QrCode, ArrowRightLeft, ArrowRight, Gamepad2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const ctaLink = user ? '/dashboard/teambuilder' : '/login'
  const ctaText = user ? 'Ir al Teambuilder' : 'Comenzar'

  return (
    <div className="min-h-screen">
      {/* Hero Section - Fondo Oscuro con estética Pokémon */}
      <div className="relative py-6 pb-8 flex flex-col items-center overflow-hidden bg-linear-to-b from-slate-900 via-blue-950 to-slate-900">
        {/* Efecto de patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-pokemon-blue rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-waves-from rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-winds-from rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl w-full mx-auto mt-0">
          {/* Logo PKDEX */}
          <div className="flex justify-center -mb-8 md:-mb-12">
            <img 
              src="/PKDEX.png" 
              alt="PKDeX Logo" 
              className="w-full max-w-sm md:max-w-2xl h-auto drop-shadow-2xl object-contain"
            />
          </div>
          
          {/* Texto Principal */}
          <h2 className="text-2xl md:text-3xl font-black mb-2 text-white uppercase tracking-wider relative z-20">
            Haz intercambios en <span className="text-pokemon-yellow">segundos</span>
          </h2>
          
          <p className="text-gray-300 text-sm md:text-base mb-6 max-w-2xl mx-auto uppercase tracking-wide font-medium">
            Consigue cualquier Pokémon legal. Diseña y arma tu equipo perfecto de forma rápida.
          </p>

          {/* Botón CTA */}
          <Link 
            href={ctaLink}
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold bg-white text-gray-900 rounded-full hover:scale-105 transition-transform shadow-2xl active:scale-95 uppercase tracking-wide"
          >
            {user ? <Gamepad2 className="w-6 h-6" /> : null}
            {ctaText}
          </Link>
        </div>
      </div>

      {/* Sección Cómo Funciona - 4 pasos */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-3 text-gray-900 uppercase tracking-tight">
            Cómo Funciona
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            Obtén tu Pokémon personalizado en 4 simples pasos
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-3 -right-1 md:right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase mb-2">Busca</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Encuentra cualquier Pokémon por nombre o número de Pokédex
              </p>
              {/* Arrow connector (hidden on mobile) */}
              <div className="hidden md:block absolute top-10 -right-3 text-gray-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sliders className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-3 -right-1 md:right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase mb-2">Personaliza</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Configura stats, naturaleza, movimientos, objeto y más
              </p>
              <div className="hidden md:block absolute top-10 -right-3 text-gray-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-3 -right-1 md:right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase mb-2">Recibe Código</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Obtén un código de intercambio de 8 dígitos al instante
              </p>
              <div className="hidden md:block absolute top-10 -right-3 text-gray-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-3 -right-1 md:right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">
                4
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase mb-2">Intercambia</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ingresa el código en tu Switch y recibe tu Pokémon
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold bg-gray-900 text-white rounded-full hover:scale-105 transition-transform shadow-lg uppercase tracking-wide"
            >
              {user ? <Gamepad2 className="w-6 h-6" /> : null}
              {ctaText} {user ? '' : 'Ahora'}
            </Link>
          </div>
        </div>
      </div>

      {/* Sección Footer - Fondo Negro */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400">Info del Juego</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Noticias</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Galería</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400">Soporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Servicio al Cliente</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Preguntas Frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400">Comunidad</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Foros</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Eventos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>PKDeX &mdash; Diseña y obtén tu Pokémon ideal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
