'use client'

import Image from 'next/image'
import type { PokemonSearchResult } from '@/lib/pokemon/types'
import { Loader2 } from 'lucide-react'

interface PokemonGridProps {
  results: PokemonSearchResult[]
  loading: boolean
  onSelect: (pokemon: PokemonSearchResult) => void
}

export function PokemonGrid({ results, loading, onSelect }: PokemonGridProps) {
  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
        <Loader2 className="w-12 h-12 text-pokemon-blue animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest">Cargando datos del PC...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 mb-4 opacity-20 grayscale">
          <img src="/PKDEX.png" alt="Empty" className="w-full h-full object-contain" />
        </div>
        <p className="text-gray-500 font-medium max-w-sm text-center">
          Usa el buscador arriba para encontrar al Pokémon que deseas entrenar y comenzar a editarlo.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {results.map((pokemon) => (
        <button
          key={pokemon.id}
          onClick={() => onSelect(pokemon)}
          className="group flex flex-col items-center bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-pokemon-blue hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 text-center"
        >
          <div className="w-full h-24 mb-3 relative flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            {pokemon.sprite ? (
              <Image
                src={pokemon.sprite}
                alt={pokemon.name}
                width={80}
                height={80}
                className="w-20 h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
              />
            ) : (
              <span className="text-gray-300 text-xs font-bold w-full uppercase">No Image</span>
            )}
          </div>
          <h3 className="font-black text-gray-900 uppercase tracking-tight w-full truncate">
            {formatPokemonName(pokemon.name)}
          </h3>
          <p className="text-xs text-gray-400 font-black mt-1">
            #{pokemon.id.toString().padStart(4, '0')}
          </p>
        </button>
      ))}
    </div>
  )
}
