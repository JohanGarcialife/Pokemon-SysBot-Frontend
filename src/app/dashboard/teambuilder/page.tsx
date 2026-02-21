'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sparkles, ArrowRightLeft } from 'lucide-react'
import PokemonSearchBar from '@/components/teambuilder/PokemonSearchBar'
import GameSelector from '@/components/teambuilder/GameSelector'
import { PokemonEditor } from '@/components/teambuilder/PokemonEditor'
import { TradeCodeModal } from '@/components/teambuilder/TradeCodeModal'
import type { GameVersion, PokemonSearchResult, Pokemon, PokemonBuild } from '@/lib/pokemon/types'
import { pokeAPI } from '@/lib/pokemon/pokeapi'
import { TYPE_COLORS } from '@/lib/pokemon/constants'

export default function TeambuilderPage() {
  const [selectedGame, setSelectedGame] = useState<GameVersion>('legends-za')
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [team, setTeam] = useState<PokemonBuild[]>([])
  const [showTradeCode, setShowTradeCode] = useState(false)

  const handlePokemonSelect = async (result: PokemonSearchResult | null) => {
    if (!result) {
      setSelectedPokemon(null)
      return
    }

    try {
      const pokemon = await pokeAPI.getPokemon(result.id)
      setSelectedPokemon(pokemon)
    } catch (error) {
      console.error('Error loading pokemon:', error)
    }
  }

  const handleAddToTeam = (build: PokemonBuild) => {
    if (team.length < 6) {
      setTeam([...team, build])
      // Show success message or animation
      console.log('Added to team:', build)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dark Header */}
      <div className="relative bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-8 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pokemon-blue opacity-10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-winds-from opacity-10 blur-3xl rounded-full" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <Sparkles className="w-10 h-10 text-pokemon-yellow" />
            <h1 className="text-5xl md:text-6xl font-black text-gradient-pokemon uppercase tracking-tight">
              Crea tu Pokémon
            </h1>
          </div>
          <p className="text-white text-lg font-medium">
            Construye tu equipo Pokémon perfecto
          </p>
        </div>
      </div>

      {/* White Search Section */}
      <div className="py-12 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Seleccionar Pokémon
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Busca y elige el Pokémon que deseas personalizar
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Game Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Versión del Juego
              </label>
              <GameSelector selected={selectedGame} onSelect={setSelectedGame} />
            </div>

            {/* Search Bar */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Buscar Pokémon
              </label>
              <PokemonSearchBar 
                onSelect={handlePokemonSelect}
                placeholder="Busca por nombre o número..."
              />
            </div>
          </div>

          {/* Info card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <p className="text-sm text-blue-800 font-medium">
              💡 <strong>Tip:</strong> Puedes buscar Pokémon por su nombre en inglés o por su número de Pokédex Nacional.
            </p>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="py-12 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Personaliza tu Pokémon
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Configura stats, naturaleza, teratipo, habilidad y movimientos
          </p>

          <PokemonEditor pokemon={selectedPokemon} onAddToTeam={handleAddToTeam} />
        </div>
      </div>

      {/* Dark Team Section - Coming Soon */}
      <div className="relative py-20 px-8 bg-linear-to-br from-blue-950 via-blue-900 to-blue-950 overflow-hidden">
        {/* Glow orb */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full" 
             style={{
               background: 'radial-gradient(circle, rgba(255,107,53,1) 0%, rgba(230,62,109,1) 33%, rgba(123,44,191,1) 66%, rgba(0,217,255,1) 100%)',
               filter: 'blur(40px)',
               opacity: 0.3
             }} 
        />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-electric uppercase tracking-tight">
            Tu Equipo ({team.length}/6)
          </h2>
          <p className="text-white text-xl mb-8">
            {team.length === 0 ? 'Agrega Pokémon a tu equipo usando el editor' : 'Team Slots próximamente'}
          </p>
          
          {/* Team Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {[1, 2, 3, 4, 5, 6].map((slot, index) => {
              const build = team[index]
              const sprite = build?.pokemon.sprites.other?.['official-artwork']?.front_default
                ?? build?.pokemon.sprites.front_default
              return (
                <div
                  key={slot}
                  className={`bg-white/10 backdrop-blur-sm border-2 ${
                    build ? 'border-green-400 bg-white/15' : 'border-white/20'
                  } rounded-xl aspect-square flex flex-col items-center justify-center overflow-hidden relative p-3`}
                >
                  {build ? (
                    <>
                      {sprite && (
                        <Image
                          src={sprite}
                          alt={build.pokemon.name}
                          width={96}
                          height={96}
                          className="w-24 h-24 object-contain drop-shadow-lg"
                        />
                      )}
                      <p className="text-white font-black uppercase tracking-wide text-sm mt-1">
                        {build.pokemon.name.charAt(0).toUpperCase() + build.pokemon.name.slice(1)}
                      </p>
                      <div className="flex gap-1 mt-1 flex-wrap justify-center">
                        {build.pokemon.types.map((t) => (
                          <span
                            key={t.type.name}
                            className={`${TYPE_COLORS[t.type.name] ?? 'bg-gray-400'} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase`}
                          >
                            {t.type.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-white/50 text-xs mt-1">Slot {slot}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-6xl text-white/30 mb-2">?</p>
                      <p className="text-white/50 font-bold">Slot {slot}</p>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Trade Code Button */}
          {team.length > 0 && (
            <button
              onClick={() => setShowTradeCode(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-full hover:scale-105 transition-transform shadow-lg uppercase tracking-wide"
            >
              <ArrowRightLeft className="w-6 h-6" />
              Solicitar Intercambio
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-400 text-sm">
            PKDeX &mdash; Diseña y obtén tu Pokémon ideal
          </p>
        </div>
      </div>

      {/* Trade Code Modal */}
      <TradeCodeModal
        isOpen={showTradeCode}
        onClose={() => setShowTradeCode(false)}
        team={team}
        gameVersion={selectedGame}
        pokemonName={
          team.length === 1
            ? team[0].pokemon.name
            : `equipo de ${team.length} Pokémon`
        }
      />
    </div>
  )
}

