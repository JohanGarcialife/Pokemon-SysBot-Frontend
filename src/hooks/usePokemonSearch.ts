'use client'

import { useState, useEffect, useCallback } from 'react'
import { pokeAPI } from '@/lib/pokemon/pokeapi'
import type { PokemonSearchResult, GameVersion } from '@/lib/pokemon/types'

export function usePokemonSearch(initialQuery: string = '', gameVersion?: GameVersion) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<PokemonSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (searchQuery: string, game?: GameVersion) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchResults = await pokeAPI.searchPokemon(searchQuery, game)
      setResults(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar Pokémon')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query, gameVersion)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, gameVersion, search])

  return {
    query,
    setQuery,
    results,
    loading,
    error
  }
}
