'use client'

import { useState, useEffect, useCallback } from 'react'
import { pokeAPI } from '@/lib/pokemon/pokeapi'
import type { PokemonSearchResult } from '@/lib/pokemon/types'

export function usePokemonSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<PokemonSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchResults = await pokeAPI.searchPokemon(searchQuery)
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
      search(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, search])

  return {
    query,
    setQuery,
    results,
    loading,
    error
  }
}
