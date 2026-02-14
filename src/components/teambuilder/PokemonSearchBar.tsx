'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { usePokemonSearch } from '@/hooks/usePokemonSearch'
import type { PokemonSearchResult } from '@/lib/pokemon/types'
import Image from 'next/image'

interface PokemonSearchBarProps {
  onSelect: (pokemon: PokemonSearchResult) => void
  placeholder?: string
}

export default function PokemonSearchBar({ onSelect, placeholder = 'Buscar Pokémon...' }: PokemonSearchBarProps) {
  const { query, setQuery, results, loading } = usePokemonSearch()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (pokemon: PokemonSearchResult) => {
    onSelect(pokemon)
    setQuery('')
    setIsOpen(false)
  }

  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pokemon-blue animate-spin" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          {results.map((pokemon) => (
            <button
              key={pokemon.id}
              onClick={() => handleSelect(pokemon)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              {/* Sprite */}
              <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {pokemon.sprite ? (
                  <Image
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900">{formatPokemonName(pokemon.name)}</p>
                <p className="text-sm text-gray-500">#{pokemon.id.toString().padStart(4, '0')}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query && !loading && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-6 text-center">
          <p className="text-gray-500">No se encontraron Pokémon</p>
        </div>
      )}
    </div>
  )
}
