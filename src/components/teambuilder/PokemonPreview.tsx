'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { pokeAPI } from '@/lib/pokemon/pokeapi'
import type { Pokemon, PokemonSearchResult } from '@/lib/pokemon/types'
import { TYPE_COLORS, TYPE_TRANSLATIONS } from '@/lib/pokemon/constants'

interface PokemonPreviewProps {
  searchResult: PokemonSearchResult | null
}

export default function PokemonPreview({ searchResult }: PokemonPreviewProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!searchResult) {
      setPokemon(null)
      return
    }

    setLoading(true)
    pokeAPI.getPokemon(searchResult.id)
      .then(setPokemon)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [searchResult])

  if (!searchResult) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-500 font-medium">Busca un Pokémon para ver su preview</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="border-water bg-white rounded-2xl p-12 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pokemon-blue animate-spin" />
      </div>
    )
  }

  if (!pokemon) {
    return null
  }

  const formatName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default || 
                 pokemon.sprites.front_default || 
                 ''

  return (
    <div className="border-water bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
      {/* Top color bar */}
      <div className="h-2 bg-water" />

      <div className="p-8">
        {/* Sprite */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-pokemon-blue rounded-full blur-xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-water rounded-full blur-xl" />
          </div>
          
          {sprite ? (
            <div className="relative w-full aspect-square">
              <Image
                src={sprite}
                alt={pokemon.name}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          ) : (
            <div className="w-full aspect-square flex items-center justify-center text-gray-400">
              No sprite
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 font-medium mb-1">
            #{pokemon.id.toString().padStart(4, '0')}
          </p>
          <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">
            {formatName(pokemon.name)}
          </h3>

          {/* Types */}
          <div className="flex justify-center gap-2">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`px-4 py-1.5 rounded-full text-white font-bold text-sm uppercase tracking-wide shadow-lg ${TYPE_COLORS[type.name] || 'bg-gray-400'}`}
              >
                {TYPE_TRANSLATIONS[type.name] || type.name}
              </span>
            ))}
          </div>
        </div>

        {/* Stats preview */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900">{pokemon.height / 10}m</p>
            <p className="text-xs text-gray-500 font-medium uppercase">Altura</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900">{pokemon.weight / 10}kg</p>
            <p className="text-xs text-gray-500 font-medium uppercase">Peso</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-water">{pokemon.base_experience || '-'}</p>
            <p className="text-xs text-gray-500 font-medium uppercase">Exp</p>
          </div>
        </div>
      </div>
    </div>
  )
}
