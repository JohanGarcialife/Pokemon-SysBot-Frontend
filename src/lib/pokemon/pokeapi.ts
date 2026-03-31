// Cliente para PokeAPI
import type { Pokemon, PokemonListResponse, PokemonSearchResult } from './types'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
const CACHE_KEY_PREFIX = 'pokeapi_'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class PokeAPIClient {
  private cache: Map<string, CacheEntry<any>> = new Map()

  constructor() {
    this.loadCacheFromLocalStorage()
  }

  private loadCacheFromLocalStorage() {
    if (typeof window === 'undefined') return

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY_PREFIX))
      keys.forEach(key => {
        const item = localStorage.getItem(key)
        if (item) {
          const entry = JSON.parse(item) as CacheEntry<any>
          // Verificar si el cache no ha expirado
          if (Date.now() - entry.timestamp < CACHE_DURATION) {
            this.cache.set(key.replace(CACHE_KEY_PREFIX, ''), entry)
          } else {
            localStorage.removeItem(key)
          }
        }
      })
    } catch (error) {
      console.error('Error loading cache from localStorage:', error)
    }
  }

  private saveCacheToLocalStorage(key: string, entry: CacheEntry<any>) {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(entry))
    } catch (error) {
      console.error('Error saving cache to localStorage:', error)
    }
  }

  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Verificar cache en memoria
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    // Fetch nuevo
    const data = await fetcher()
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    }

    this.cache.set(key, entry)
    this.saveCacheToLocalStorage(key, entry)

    return data
  }

  async getPokemonList(limit: number = 1010, offset: number = 0): Promise<PokemonListResponse> {
    return this.fetchWithCache(
      `pokemon_list_${limit}_${offset}`,
      async () => {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
        if (!response.ok) throw new Error('Failed to fetch Pokemon list')
        return response.json()
      }
    )
  }

  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    return this.fetchWithCache(
      `pokemon_${idOrName}`,
      async () => {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`)
        if (!response.ok) throw new Error(`Failed to fetch Pokemon: ${idOrName}`)
        return response.json()
      }
    )
  }

  async searchPokemon(query: string): Promise<PokemonSearchResult[]> {
    const list = await this.getPokemonList()
    
    const normalizedQuery = query.toLowerCase().trim()
    
    // Regional forms from ZA DLC — these are NOT in the standard /pokemon?limit=1010 list
    // because PokeAPI places them at IDs 10000+. We inject them as a static supplement.
    const REGIONAL_FORMS: { name: string; displayName: string; apiName?: string }[] = [
      // Alolan forms
      { name: 'meowth-alola',       displayName: 'meowth-alola' },
      { name: 'persian-alola',      displayName: 'persian-alola' },
      { name: 'raichu-alola',       displayName: 'raichu-alola' },
      { name: 'vulpix-alola',       displayName: 'vulpix-alola' },
      { name: 'ninetales-alola',    displayName: 'ninetales-alola' },
      { name: 'sandshrew-alola',    displayName: 'sandshrew-alola' },
      { name: 'sandslash-alola',    displayName: 'sandslash-alola' },
      { name: 'diglett-alola',      displayName: 'diglett-alola' },
      { name: 'dugtrio-alola',      displayName: 'dugtrio-alola' },
      { name: 'geodude-alola',      displayName: 'geodude-alola' },
      { name: 'graveler-alola',     displayName: 'graveler-alola' },
      { name: 'golem-alola',        displayName: 'golem-alola' },
      { name: 'grimer-alola',       displayName: 'grimer-alola' },
      { name: 'muk-alola',          displayName: 'muk-alola' },
      { name: 'marowak-alola',      displayName: 'marowak-alola' },
      { name: 'exeggutor-alola',    displayName: 'exeggutor-alola' },
      // Galarian forms
      { name: 'meowth-galar',       displayName: 'meowth-galar' },
      { name: 'farfetchd-galar',    displayName: 'farfetchd-galar' },
      { name: 'slowpoke-galar',     displayName: 'slowpoke-galar' },
      { name: 'mr-mime-galar',      displayName: 'mr-mime-galar' },
      // Hisuian forms
      { name: 'growlithe-hisui',    displayName: 'growlithe-hisui' },
      { name: 'arcanine-hisui',     displayName: 'arcanine-hisui' },
      { name: 'qwilfish-hisui',     displayName: 'qwilfish-hisui' },
      // Zygarde forms
      { name: 'zygarde-10%-c',      displayName: 'zygarde-10%-c', apiName: 'zygarde-10' },
      { name: 'zygarde-complete',   displayName: 'zygarde-complete' },
    ]

    // 1. Standard results from the main Pokémon list
    const standardResults = list.results
      .map((item, index) => ({
        id: index + 1,
        name: item.name,
        url: item.url,
        isRegional: false,
        apiName: item.name,
      }))
      .filter(item => {
        const matchesName = item.name.includes(normalizedQuery)
        const matchesId = item.id.toString() === normalizedQuery
        return matchesName || matchesId
      })

    // 2. Regional forms filtered by query
    const regionalResults = REGIONAL_FORMS
      .filter(form => form.name.includes(normalizedQuery) || form.displayName.includes(normalizedQuery))
      .map(form => ({
        id: 0,   // will be resolved from PokeAPI
        name: form.displayName,
        url: `https://pokeapi.co/api/v2/pokemon/${form.apiName || form.name}`,
        isRegional: true,
        apiName: form.apiName || form.name,
      }))

    // Merge, deduplicate, limit to 12
    const combined = [...standardResults, ...regionalResults].slice(0, 12)

    // Fetch sprites for all results
    return Promise.all(
      combined.map(async item => {
        try {
          const pokemon = await this.getPokemon(item.apiName)
          return {
            id: pokemon.id,
            name: item.name,
            sprite: pokemon.sprites.other?.['official-artwork']?.front_default || 
                    pokemon.sprites.front_default || 
                    ''
          }
        } catch (error) {
          console.error(`Error fetching sprite for ${item.name}:`, error)
          return {
            id: item.id || 0,
            name: item.name,
            sprite: ''
          }
        }
      })
    )
  }

  clearCache() {
    this.cache.clear()
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY_PREFIX))
      keys.forEach(key => localStorage.removeItem(key))
    }
  }
}

// Singleton instance
export const pokeAPI = new PokeAPIClient()
