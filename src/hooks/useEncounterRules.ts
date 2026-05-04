'use client'

import { useMemo } from 'react'
import { GAME_LEGALITY_RULES, PokemonSpeciesRules } from '@/lib/pokemon/legalityData'
import { GameVersion } from '@/lib/pokemon/types'

export interface EncounterRulesResult {
  isShinyDisabled: boolean
  isAlphaDisabled: boolean
  isPokemonNotAvailable: boolean
  forcedBall: string | null
  minAllowedLevel: number
  disabledFeatures: string[]
  disabledOrigins: string[]
  speciesRules: PokemonSpeciesRules | null
}

/**
 * useEncounterRules
 * Hook para obtener dinámicamente las restricciones aplicables según el juego, el origen y el Pokémon
 */
export function useEncounterRules(
  gameVersion?: GameVersion,
  origin?: string,
  pokemonSlug?: string
): EncounterRulesResult {
  return useMemo(() => {
    const defaultResult: EncounterRulesResult = {
      isShinyDisabled: false,
      isAlphaDisabled: false,
      isPokemonNotAvailable: false,
      forcedBall: null,
      minAllowedLevel: 1,
      disabledFeatures: [],
      disabledOrigins: [],
      speciesRules: null
    }

    if (!gameVersion || !origin) {
      return defaultResult
    }

    const gameRules = GAME_LEGALITY_RULES[gameVersion]
    if (!gameRules) {
      return defaultResult
    }

    const originRules = gameRules.origins[origin]

    // Règlas por especie de Pokémon (shiny lock por Pokémon específico)
    const speciesRules: PokemonSpeciesRules | null =
      pokemonSlug && gameRules.pokemonRules
        ? (gameRules.pokemonRules[pokemonSlug.toLowerCase()] ?? null)
        : null

    // Shiny disabled si: el origen lo bloquea O la especie está shiny-locked en este juego
    const originShinyLocked = originRules?.shinyLocked ?? false
    const speciesShinyLocked = speciesRules?.shinyLocked ?? false
    const isShinyDisabled = originShinyLocked || speciesShinyLocked

    // Alpha disabled si: el origen lo bloquea O la especie está alpha-locked en este juego
    const originAlphaLocked = originRules?.alphaLocked ?? false
    const speciesAlphaLocked = speciesRules?.alphaLocked ?? false
    const isAlphaDisabled = originAlphaLocked || speciesAlphaLocked

    // Pokémon no disponible en este juego
    const isPokemonNotAvailable = speciesRules?.notAvailable ?? false

    // Calcular orígenes deshabilitados (combinando los del juego y los de la especie)
    let disabledOrigins = [...(gameRules.disabledOrigins || [])]
    if (speciesRules?.availableOrigins) {
      const allOrigins = Object.keys(gameRules.origins)
      const notAvailable = allOrigins.filter(o => !speciesRules.availableOrigins!.includes(o))
      disabledOrigins = [...new Set([...disabledOrigins, ...notAvailable])]
    }

    return {
      isShinyDisabled,
      isAlphaDisabled,
      isPokemonNotAvailable,
      forcedBall: originRules?.fixedBall ?? null,
      minAllowedLevel: originRules?.minLevel ?? 1,
      disabledFeatures: gameRules.disabledFeatures || [],
      disabledOrigins,
      speciesRules
    }
  }, [gameVersion, origin, pokemonSlug])
}
