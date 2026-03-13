import { GameVersion } from './types'

export interface OriginRules {
  shinyLocked: boolean
  minLevel: number
  fixedBall?: string // Null or undefined si la ball es de libre elección
}

export interface GameRules {
  disabledFeatures: string[] // Ejemplo: ['teraType', 'evs'] para indicar qué secciones ocultar o ignorar
  origins: Record<string, OriginRules> // Mapeo de nombre de origen a sus reglas específicas
}

// Emulación de Encounter Tables de PKHeX para la validación del frontend
export const GAME_LEGALITY_RULES: Partial<Record<GameVersion, GameRules>> = {
  'legends-za': {
    // Mecánicas que no existen en este juego y que deben deshabilitarse si la UI lo permitiera
    disabledFeatures: ['teraType', 'evs'], 
    origins: {
      'Wild Encounter': {
        shinyLocked: false,
        minLevel: 1
      },
      'Egg': {
        shinyLocked: false,
        minLevel: 1
      },
      'Mass Outbreak': {
        shinyLocked: false,
        minLevel: 1
      },
      'Trade': {
        shinyLocked: false,
        minLevel: 1
      },
      'In-Game Gift': {
        shinyLocked: true,
        minLevel: 5,
        fixedBall: 'Poké Ball'
      },
      'Starter': {
        shinyLocked: true,
        minLevel: 5,
        fixedBall: 'Poké Ball'
      },
      'Event': {
        shinyLocked: true, // Asumimos shiny lock en eventos por defecto a menos que sea un evento específico
        minLevel: 10,
        fixedBall: 'Cherish Ball'
      },
      'Tera Raid': {
        // En legends-za no existen, pero para no romper el tipo si el usuario llega a pasarlo
        shinyLocked: false,
        minLevel: 1
      }
    }
  }
}
