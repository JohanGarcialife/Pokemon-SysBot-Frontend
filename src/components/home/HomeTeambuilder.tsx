'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightLeft, Sparkles, Filter, Info, Server, ChevronRight, Search, Loader2 } from 'lucide-react'
import GameSelector from '@/components/teambuilder/GameSelector'
import { PokemonGrid } from '@/components/teambuilder/PokemonGrid'
import { PokemonEditorModal } from '@/components/teambuilder/PokemonEditorModal'
import { usePokemonSearch } from '@/hooks/usePokemonSearch'
import type { GameVersion, PokemonSearchResult, Pokemon, PokemonBuild } from '@/lib/pokemon/types'
import { pokeAPI } from '@/lib/pokemon/pokeapi'

const PENDING_BUILD_KEY = 'pkdex_pending_build'

interface HomeTeambuilderProps {
  user: any // Supabase user
}

export default function HomeTeambuilder({ user }: HomeTeambuilderProps) {
  const router = useRouter()
  const [selectedGame, setSelectedGame] = useState<GameVersion>('legends-za')
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { query, setQuery, results, loading } = usePokemonSearch()

  // On mount: check for a build saved before the login redirect
  // We use empty deps [] to run exactly once on mount — user is already set
  // by the server component so the closure captures the correct value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) return
    try {
      const saved = localStorage.getItem(PENDING_BUILD_KEY)
      if (saved) {
        const pending: { pokemon: Pokemon; build: PokemonBuild } = JSON.parse(saved)
        localStorage.removeItem(PENDING_BUILD_KEY)
        setSelectedPokemon(pending.pokemon)
        setIsModalOpen(true)
      }
    } catch {
      localStorage.removeItem(PENDING_BUILD_KEY)
    }
  }, []) // intentionally empty — run once on mount

  const handlePokemonSelect = async (result: PokemonSearchResult | null) => {
    if (!result) {
      setSelectedPokemon(null)
      return
    }
    try {
      const pokemon = await pokeAPI.getPokemon(result.id)
      setSelectedPokemon(pokemon)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading pokemon:', error)
    }
  }

  const handleAddToTeam = (build: PokemonBuild) => {
    if (!user) {
      // Save the current build and pokemon to localStorage so it survives the login redirect
      if (selectedPokemon) {
        try {
          localStorage.setItem(PENDING_BUILD_KEY, JSON.stringify({ pokemon: selectedPokemon, build }))
        } catch { /* storage full or unavailable */ }
      }
      // Redirect to login with a redirect-back URL
      const currentPath = window.location.pathname === '/' ? '/teambuilder' : window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
      return
    }
    // User is logged in — proceed to add to team
    console.log('Added', build)
    router.push('/dashboard')
  }

  return (
    <div className="w-full">
      {/* BLOQUE DE CONTROL (El Cerebro) */}
      <div className="py-12 px-6 bg-white w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
              Crea tu Pokémon <span className="text-pokemon-blue">Ideal</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Selecciona tu juego, busca el Pokémon que deseas y configúralo con estadísticas competitivas en segundos.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-6 bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            {/* Game Selector (Takes 5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <label className="flex items-center gap-2 text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                <span className="bg-pokemon-blue w-6 h-6 flex items-center justify-center rounded-full text-white">1</span>
                Versión del Juego
              </label>
              <GameSelector selected={selectedGame} onSelect={setSelectedGame} />
            </div>

            {/* Separator */}
            <div className="hidden md:flex col-span-1 justify-center items-center">
              <ChevronRight className="w-8 h-8 text-gray-300" />
            </div>

            {/* Search Bar (Takes 6 cols) */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <label className="flex items-center gap-2 text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                <span className="bg-pokemon-blue w-6 h-6 flex items-center justify-center rounded-full text-white">2</span>
                Buscar Pokémon
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ejemplo: Charizard, Arceus..."
                  className="w-full bg-white border-2 border-gray-300 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
                />
                {loading && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pokemon-blue animate-spin" />
                )}
              </div>
              <div className="flex gap-2 mt-4 items-center">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Filtros Rápidos:</span>
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-600 hover:border-pokemon-blue cursor-pointer transition-colors">🔥 Fuego</span>
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-600 hover:border-pokemon-blue cursor-pointer transition-colors">✨ Legendarios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE DE CONTENIDO (El Cuerpo) */}
      <div id="editor-section" className="py-12 px-6 bg-gray-100 border-t border-gray-200 min-h-[600px] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-pokemon-blue w-8 h-8 flex items-center justify-center rounded-full text-white font-black">3</span>
            <h3 className="text-2xl font-black text-gray-900 uppercase">Selecciona para Editar</h3>
          </div>
          <PokemonGrid 
            results={results} 
            loading={loading} 
            onSelect={handlePokemonSelect} 
          />
        </div>
      </div>

      {/* BLOQUE DE CONFIANZA (El Pie) */}
      <div className="py-16 px-6 bg-white border-t border-gray-200">
         <div className="max-w-7xl mx-auto">
            {/* Status & Trust */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
              <div className="flex items-center gap-4 bg-green-50 border border-green-200 px-6 py-4 rounded-2xl">
                <div className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </div>
                <div>
                  <h4 className="font-black text-green-900 uppercase tracking-tight">Sistemas Operativos</h4>
                  <p className="text-green-700 text-sm">Bots en línea 24/7 para intercambios inmediatos.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center text-sm font-bold text-gray-600">
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><Server className="w-5 h-5" /></div>
                   <span>Intercambios Seguros</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><ArrowRightLeft className="w-5 h-5" /></div>
                   <span>Entrega en Segundos</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                   <span>100% Legales</span>
                 </div>
              </div>
            </div>

            {/* FAQ Mini */}
            <div className="grid md:grid-cols-2 gap-12">
               <div>
                 <h3 className="text-2xl font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
                   <Info className="w-6 h-6 text-pokemon-blue" />
                   Preguntas Frecuentes
                 </h3>
                 <div className="space-y-6">
                   <div>
                     <h4 className="font-bold text-gray-900 mb-1">¿Cómo funciona el intercambio?</h4>
                     <p className="text-gray-600 text-sm leading-relaxed">Una vez configures tu Pokémon, el sistema generará un Código de Intercambio de 8 dígitos. Introdúcelo en el "Poképortal" de tu juego para conectarte con nuestro bot automático.</p>
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 mb-1">¿Los Pokémon son legales para jugar online?</h4>
                     <p className="text-gray-600 text-sm leading-relaxed">Sí. Todos los Pokémon son generados siguiendo el mismo estándar de validación que <strong>Pokémon Showdown</strong>, garantizando movimientos, estadísticas y habilidades 100% legales. Ningún Pokémon imposible puede ser enviado, protegiendo siempre tu cuenta.</p>
                   </div>
                 </div>
               </div>
               <div className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-white uppercase mb-4">
                    ¿Listo para empezar?
                  </h3>
                  <p className="text-gray-400 mb-8">Únete a cientos de jugadores que ya están optimizando su tiempo competitivo.</p>
                  {!user && (
                    <button onClick={() => router.push('/login')} className="w-full bg-linear-to-r from-pokemon-blue to-blue-500 py-4 rounded-xl font-black tracking-widest uppercase hover:scale-105 transition-transform">
                      Crear Cuenta Gratis
                    </button>
                  )}
               </div>
            </div>
         </div>
      </div>

      <PokemonEditorModal
        pokemon={selectedPokemon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToTeam={handleAddToTeam}
      />
    </div>
  )
}
