import { useState, useEffect, useMemo } from 'react'
import { GAME_LEGALITY_RULES, PokemonSpeciesRules } from '@/lib/pokemon/legalityData'
import { GameVersion } from '@/lib/pokemon/types'
import { pokeAPI } from '@/lib/pokemon/pokeapi'

export interface EncounterRulesResult {
  isShinyDisabled: boolean
  isAlphaDisabled: boolean
  isPokemonNotAvailable: boolean
  forcedBall: string | null
  minAllowedLevel: number
  maxAllowedLevel: number
  disabledFeatures: string[]
  disabledOrigins: string[]
  speciesRules: PokemonSpeciesRules | null
  matchingEncounters: any[]
  selectedEncounter: any | null
}

function mapOriginToMethod(origin?: string): string[] {
  if (!origin) return []
  switch (origin) {
    case 'Wild Encounter':
    case 'Mass Outbreak':
      return ['Wild', 'Static']
    case 'In-Game Gift':
      return ['Gift']
    case 'Starter':
      return ['Starter']
    case 'Trade':
      return ['Trade']
    case 'Pokémon HOME':
      return ['HOME Legal Transfer', 'HOME Event Transfer']
    default:
      return []
  }
}

export function useEncounterRules(
  gameVersion?: GameVersion,
  origin?: string,
  pokemonSlug?: string,
  selectedEncounterId?: string
): EncounterRulesResult {
  const [dbEncounters, setDbEncounters] = useState<any[]>([])

  useEffect(() => {
    const isZA = gameVersion === 'legends-za'
    const isSV = gameVersion === 'scarlet' || gameVersion === 'violet'

    if ((!isZA && !isSV) || !pokemonSlug) {
      setDbEncounters([])
      return
    }

    let active = true
    const load = async () => {
      try {
        const info = isZA 
          ? await pokeAPI.getZAPokemonInfo(pokemonSlug)
          : await pokeAPI.getSVPokemonInfo(pokemonSlug)
        if (!info || !active) return

        const baseURL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:4000'
          : (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pkdex-backend-production.up.railway.app')

        const path = isZA ? 'za' : 'sv'
        const res = await fetch(`${baseURL}/api/${path}/pokemon/${info.species}/encounters?form=${info.form}`)
        if (!res.ok) throw new Error('Encounter fetch failed')
        const data = await res.json()
        if (active) {
          setDbEncounters(Array.isArray(data) ? data : (data.results || []))
        }
      } catch (err) {
        console.error('Error fetching encounters in useEncounterRules:', err)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [gameVersion, pokemonSlug])

  return useMemo(() => {
    const defaultResult: EncounterRulesResult = {
      isShinyDisabled: false,
      isAlphaDisabled: false,
      isPokemonNotAvailable: false,
      forcedBall: null,
      minAllowedLevel: 1,
      maxAllowedLevel: 100,
      disabledFeatures: [],
      disabledOrigins: [],
      speciesRules: null,
      matchingEncounters: [],
      selectedEncounter: null
    }

    if (!gameVersion || !origin) {
      return defaultResult
    }

    const gameRules = GAME_LEGALITY_RULES[gameVersion]
    if (!gameRules) {
      return defaultResult
    }

    const originRules = gameRules.origins[origin]

    // Reglas por especie de Pokémon (shiny lock por Pokémon específico)
    const speciesRules: PokemonSpeciesRules | null =
      pokemonSlug && gameRules.pokemonRules
        ? (gameRules.pokemonRules[pokemonSlug.toLowerCase()] ?? null)
        : null

    // Base rules
    let isShinyDisabled = originRules?.shinyLocked ?? false
    let isAlphaDisabled = originRules?.alphaLocked ?? false
    const isPokemonNotAvailable = speciesRules?.notAvailable ?? false
    let forcedBall: string | null = originRules?.fixedBall ?? null
    let minAllowedLevel = originRules?.minLevel ?? 1
    let maxAllowedLevel = 100

    let disabledOrigins = [...(gameRules.disabledOrigins || [])]
    let matchingEncounters: any[] = []
    let selectedEncounter: any | null = null

    const isZA = gameVersion === 'legends-za'
    const isSV = gameVersion === 'scarlet' || gameVersion === 'violet'

    if (isZA || isSV) {
      if (dbEncounters.length > 0) {
        const methodsPresent = new Set(dbEncounters.map(e => e.method))
        
        // Dynamically disable origins not supported by this Pokemon's encounters
        const newDisabled = [...(gameRules.disabledOrigins || [])]
        if (!methodsPresent.has('Wild') && !methodsPresent.has('Static') && !methodsPresent.has('Fixed Spawn')) {
          newDisabled.push('Wild Encounter', 'Mass Outbreak')
        }
        if (!methodsPresent.has('Gift')) {
          newDisabled.push('In-Game Gift')
        }
        if (!methodsPresent.has('Starter')) {
          newDisabled.push('Starter')
        }
        if (!methodsPresent.has('Trade')) {
          newDisabled.push('Trade')
        }
        if (!methodsPresent.has('HOME Legal Transfer') && !methodsPresent.has('HOME Event Transfer')) {
          newDisabled.push('Pokémon HOME')
        }
        disabledOrigins = [...new Set(newDisabled)]

        const methods = mapOriginToMethod(origin)
        matchingEncounters = dbEncounters.filter(e => methods.includes(e.method))

        if (matchingEncounters.length > 0) {
          if (selectedEncounterId) {
            selectedEncounter = matchingEncounters.find(e => e.id === selectedEncounterId) || null
          }
          if (!selectedEncounter) {
            selectedEncounter = matchingEncounters[0]
          }

          if (selectedEncounter) {
            isShinyDisabled = selectedEncounter.shinyLocked || selectedEncounter.shiny === 'Never'
            isAlphaDisabled = !(selectedEncounter.alpha ?? selectedEncounter.isAlpha)
            minAllowedLevel = selectedEncounter.minLevel ?? selectedEncounter.levelMin ?? 1
            maxAllowedLevel = selectedEncounter.maxLevel ?? selectedEncounter.levelMax ?? 100
            forcedBall = selectedEncounter.fixedBall || null
          }
        }
      } else {
        // Fallback when encounters haven't loaded yet
        const speciesShinyLocked = speciesRules?.shinyLocked ?? false
        isShinyDisabled = isShinyDisabled || speciesShinyLocked
        const speciesAlphaLocked = speciesRules?.alphaLocked ?? false
        isAlphaDisabled = isAlphaDisabled || speciesAlphaLocked
      }
    } else {
      // Fallback/standard games
      const speciesShinyLocked = speciesRules?.shinyLocked ?? false
      isShinyDisabled = isShinyDisabled || speciesShinyLocked
      const speciesAlphaLocked = speciesRules?.alphaLocked ?? false
      isAlphaDisabled = isAlphaDisabled || speciesAlphaLocked

      if (speciesRules?.availableOrigins) {
        const allOrigins = Object.keys(gameRules.origins)
        const notAvailable = allOrigins.filter(o => !speciesRules.availableOrigins!.includes(o))
        disabledOrigins = [...new Set([...disabledOrigins, ...notAvailable])]
      }
    }

    return {
      isShinyDisabled,
      isAlphaDisabled,
      isPokemonNotAvailable,
      forcedBall,
      minAllowedLevel,
      maxAllowedLevel,
      disabledFeatures: gameRules.disabledFeatures || [],
      disabledOrigins,
      speciesRules,
      matchingEncounters,
      selectedEncounter
    }
  }, [gameVersion, origin, pokemonSlug, dbEncounters, selectedEncounterId])
}
