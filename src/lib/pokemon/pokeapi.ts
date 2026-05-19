// Cliente para PokeAPI
import type { Pokemon, PokemonListResponse, PokemonSearchResult, GameVersion } from './types'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
const CACHE_KEY_PREFIX = 'pokeapi_'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

const formArtwork: Record<string, number> = {
  '19-1':10091,'20-1':10092,'26-1':10100,'27-1':10101,'28-1':10102,'37-1':10103,'38-1':10104,'50-1':10105,'51-1':10106,'52-1':10107,'52-2':10161,'53-1':10108,'58-1':10229,'59-1':10230,'79-1':10164,'80-2':10165,'83-1':10166,'88-1':10112,'89-1':10113,'100-1':10231,'101-1':10232,'103-1':10114,'105-1':10115,'110-1':10167,'122-1':10168,'199-1':10172,'211-1':10234,'215-1':10235,'222-1':10173,'263-1':10174,'264-1':10175,'479-1':10008,'479-2':10009,'479-3':10010,'479-4':10011,'479-5':10012,'503-1':10236,'549-1':10237,'550-1':10016,'550-2':10247,'562-1':10179,'570-1':10238,'571-1':10239,'618-1':10180,'628-1':10240,'705-1':10241,'706-1':10242,'713-1':10243,'724-1':10244,'849-1':10184,'876-1':10186,'877-1':10187,'901-1':10272,'902-1':10248,'916-1':10254,'931-1':10261,'931-2':10262,'931-3':10263,'978-1':10258,'978-2':10259,'999-1':10264
};

function getPokemonSpriteUrl(species: number, form: number = 0): string {
  const key = `${species}-${form}`;
  const artworkId = formArtwork[key] || species;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${artworkId}.png`;
}

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

  async getPokemonList(limit: number = 1300, offset: number = 0): Promise<PokemonListResponse> {
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

  async getZAPokemonList(): Promise<any[]> {
    return this.fetchWithCache(
      `za_pokemon_list`,
      async () => {
        const baseURL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:4000'
          : (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pkdex-backend-production.up.railway.app')
        const response = await fetch(`${baseURL}/api/za/pokemon`)
        if (!response.ok) throw new Error('Failed to fetch ZA Pokemon list')
        return response.json()
      }
    )
  }

  async getZAPokemonInfo(name: string) {
    const list = await this.getZAPokemonList()
    const normalizedName = name.toLowerCase().trim()
    const matched = list.find(p => p.name === normalizedName)
    return matched ? { species: matched.species, form: matched.form } : null
  }

  async getSVPokemonList(): Promise<any[]> {
    return this.fetchWithCache(
      `sv_pokemon_list`,
      async () => {
        const baseURL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:4000'
          : (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pkdex-backend-production.up.railway.app')
        const response = await fetch(`${baseURL}/api/sv/pokemon`)
        if (!response.ok) throw new Error('Failed to fetch SV Pokemon list')
        return response.json()
      }
    )
  }

  async getSVPokemonInfo(name: string) {
    const list = await this.getSVPokemonList()
    const normalizedName = name.toLowerCase().trim()
    const matched = list.find(p => p.name === normalizedName)
    return matched ? { species: matched.species, form: matched.form } : null
  }

  async searchPokemon(query: string, gameVersion?: GameVersion, methodFilter?: string): Promise<PokemonSearchResult[]> {
    const normalizedQuery = query.toLowerCase().trim()

    if (gameVersion === 'legends-za') {
      const list = await this.getZAPokemonList()
      const filtered = list.filter(item => {
        const nameMatch = !normalizedQuery || [
          item.displayName,
          item.displayNameEn,
          item.name,
          item.nameEn,
          item.formLabel,
          String(item.species),
          ...(item.searchAliases || [])
        ].some(v => String(v || '').toLowerCase().includes(normalizedQuery))

        const methodMatch = !methodFilter || (item.methods || []).includes(methodFilter)
        return nameMatch && methodMatch
      })

      return filtered.map(item => ({
        id: item.species,
        name: item.displayName || item.name,
        sprite: getPokemonSpriteUrl(item.species, item.form || 0),
        apiName: item.name,
        zaSpecies: item.species,
        zaForm: item.form,
        methods: item.methods || [],
        encounterCount: item.encounterCount || 0
      }))
    }

    if (gameVersion === 'scarlet' || gameVersion === 'violet') {
      const list = await this.getSVPokemonList()
      const filtered = list.filter(item => {
        const nameMatch = !normalizedQuery || [
          item.displayName,
          item.displayNameEn,
          item.name,
          item.nameEn,
          item.formLabel,
          String(item.species),
          ...(item.searchAliases || [])
        ].some(v => String(v || '').toLowerCase().includes(normalizedQuery))

        const methodMatch = !methodFilter || (item.methods || []).includes(methodFilter)
        return nameMatch && methodMatch
      })

      return filtered.map(item => ({
        id: item.species,
        name: item.displayName || item.name,
        sprite: getPokemonSpriteUrl(item.species, item.form || 0),
        apiName: item.name,
        svSpecies: item.species,
        svForm: item.form,
        methods: item.methods || [],
        encounterCount: item.encounterCount || 0
      }))
    }

    const list = await this.getPokemonList()
    
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
      { name: 'zygarde-10%',      displayName: 'zygarde-10%', apiName: 'zygarde-10' },
      { name: 'zygarde-complete',   displayName: 'zygarde-complete' },
      // SV DLC Exclusives (Not available in standard limit due to API offset)
      { name: 'ogerpon', displayName: 'ogerpon' },
      { name: 'ogerpon-wellspring-mask', displayName: 'ogerpon-wellspring-mask' },
      { name: 'ogerpon-hearthflame-mask', displayName: 'ogerpon-hearthflame-mask' },
      { name: 'ogerpon-cornerstone-mask', displayName: 'ogerpon-cornerstone-mask' },
      { name: 'pecharunt', displayName: 'pecharunt' },
      { name: 'terapagos', displayName: 'terapagos' },
      // NOTE: terapagos-terastal and terapagos-stellar are NOT tradeable — excluded
      { name: 'okidogi', displayName: 'okidogi' },
      { name: 'munkidori', displayName: 'munkidori' },
      { name: 'fezandipiti', displayName: 'fezandipiti' },
      { name: 'gouging-fire', displayName: 'gouging-fire' },
      { name: 'raging-bolt', displayName: 'raging-bolt' },
      { name: 'walking-wake', displayName: 'walking-wake' },
      { name: 'iron-leaves', displayName: 'iron-leaves' },
      { name: 'iron-boulder', displayName: 'iron-boulder' },
      { name: 'iron-crown', displayName: 'iron-crown' },
      { name: 'poltchageist', displayName: 'poltchageist' },
      { name: 'sinistcha', displayName: 'sinistcha' },
      { name: 'dipplin', displayName: 'dipplin' },
      { name: 'hydrapple', displayName: 'hydrapple' },
      { name: 'archaludon', displayName: 'archaludon' },
    ]

    // Forms that are NOT tradeable and should be hidden from the teambuilder search
    const NON_TRADEABLE_SUFFIXES = ['-mega', '-gmax', '-eternamax', '-primal', '-origin', '-ultra']
    const NON_TRADEABLE_EXACT = new Set([
      'terapagos-terastal', 'terapagos-stellar',
      'zacian-crowned', 'zamazenta-crowned',
      'calyrex-ice', 'calyrex-shadow',
      'urshifu-rapid-strike-gmax', 'urshifu-single-strike-gmax',
      'meloetta-pirouette',  // Only base Meloetta is selectable (pirouette is a battle-only form)
    ])

    // 1. Standard results from the main Pokémon list — filter non-tradeable forms
    const standardResults = list.results
      .map((item, index) => ({
        id: index + 1,
        name: item.name,
        url: item.url,
        isRegional: false,
        apiName: item.name,
      }))
      .filter(item => {
        // Exclude non-tradeable forms
        if (NON_TRADEABLE_EXACT.has(item.name)) return false
        if (NON_TRADEABLE_SUFFIXES.some(suffix => item.name.endsWith(suffix))) return false
        // Match query
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
                    '',
            apiName: item.apiName
          }
        } catch (error) {
          console.error(`Error fetching sprite for ${item.name}:`, error)
          return {
            id: item.id || 0,
            name: item.name,
            sprite: '',
            apiName: item.apiName
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
