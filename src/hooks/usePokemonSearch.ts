'use client'

import { useState, useEffect, useCallback } from 'react'
import { pokeAPI } from '@/lib/pokemon/pokeapi'
import type { PokemonSearchResult, GameVersion } from '@/lib/pokemon/types'

export function usePokemonSearch(initialQuery: string = '', gameVersion?: GameVersion) {
  const [query, setQuery] = useState(initialQuery)
  const [method, setMethod] = useState('')
  const [results, setResults] = useState<PokemonSearchResult[]>([])
  const [availableMethods, setAvailableMethods] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (searchQuery: string, game?: GameVersion, methodFilter?: string) => {
    setLoading(true)
    setError(null)

    try {
      const searchResults = await pokeAPI.searchPokemon(searchQuery, game, methodFilter)
      setResults(searchResults)
      
      // Update available methods based on full un-filtered list for this game version
      if (game) {
        const fullList = await pokeAPI.searchPokemon('', game)
        const methods = Array.from(new Set(fullList.flatMap(p => p.methods || []))).sort()
        setAvailableMethods(methods)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar Pokémon')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Run search when query, method, or gameVersion changes
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query, gameVersion, method)
    }, 200)

    return () => clearTimeout(timer)
  }, [query, gameVersion, method, search])

  return {
    query,
    setQuery,
    method,
    setMethod,
    availableMethods,
    results,
    loading,
    error
  }
}
