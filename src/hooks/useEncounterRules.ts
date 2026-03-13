'use client'

import { useMemo } from 'react'
import { GAME_LEGALITY_RULES, OriginRules } from '@/lib/pokemon/legalityData'
import { GameVersion } from '@/lib/pokemon/types'

export interface EncounterRulesResult {
  isShinyDisabled: boolean
  forcedBall: string | null
  minAllowedLevel: number
  disabledFeatures: string[]
}

/**
 * useEncounterRules
 * Hook para obtener dinámicamente las restricciones aplicables según el juego y el origen
 */
export function useEncounterRules(gameVersion?: GameVersion, origin?: string): EncounterRulesResult {
  return useMemo(() => {
    // Valores por defecto
    const defaultResult: EncounterRulesResult = {
      isShinyDisabled: false,
      forcedBall: null,
      minAllowedLevel: 1,
      disabledFeatures: []
    }

    if (!gameVersion || !origin) {
      return defaultResult
    }

    const gameRules = GAME_LEGALITY_RULES[gameVersion]
    if (!gameRules) {
      return defaultResult
    }

    const originRules = gameRules.origins[origin]
    
    return {
      isShinyDisabled: originRules?.shinyLocked ?? false,
      forcedBall: originRules?.fixedBall ?? null,
      minAllowedLevel: originRules?.minLevel ?? 1,
      disabledFeatures: gameRules.disabledFeatures || []
    }
  }, [gameVersion, origin])
}
