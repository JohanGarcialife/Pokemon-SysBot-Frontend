import Link from 'next/link'
import Image from 'next/image'
import { Zap, Shield, Sparkles, Search, Sliders, QrCode, ArrowRightLeft, ArrowRight, Gamepad2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import HomeTeambuilder from '@/components/home/HomeTeambuilder'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const ctaLink = user ? '/dashboard' : '/login'
  const ctaText = user ? 'Ir al Dashboard' : 'Comenzar'

  return (
    <div className="min-h-screen">
      {/* Hero Section - Dualidad fuego/agua */}
      <div className="relative py-6 pb-8 flex flex-col items-center overflow-hidden w-full">
        {/* Background: imagen estirada 100% ancho/alto para cubrir de borde a borde */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Dark overlay para legibilidad */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Bottom fade hacia el bloque blanco de abajo */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-transparent to-white/50" />
        
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
          <h2 className="text-2xl md:text-3xl font-black mb-2 text-white uppercase tracking-wider relative z-20 drop-shadow-lg">
            Haz intercambios en <span className="text-pokemon-yellow">segundos</span>
          </h2>
          
          <p className="text-gray-200 text-sm md:text-base mb-6 max-w-2xl mx-auto uppercase tracking-wide font-medium drop-shadow">
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

      {/* Integración Principal Teambuilder */}
      <HomeTeambuilder user={user} />

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
