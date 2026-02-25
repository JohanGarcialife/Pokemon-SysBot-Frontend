/**
 * legalityRules.ts
 * Pure validation logic for Pokémon builds.
 * Returns an array of ValidationResult sorted by severity.
 */

import { PokemonBuild, PokemonStats } from './types'
import { STAT_LIMITS } from './constants'

// ============================================================
// Types
// ============================================================

export type ValidationSeverity = 'error' | 'warning'

export interface ValidationResult {
  id: string
  severity: ValidationSeverity
  field: 'stats' | 'level' | 'moves' | 'ability' | 'gender' | 'item' | 'general'
  message: string
}

// ============================================================
// Helpers
// ============================================================

const STAT_LABELS: Record<keyof PokemonStats, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  spAttack: 'SP.ATK',
  spDefense: 'SP.DEF',
  speed: 'SPD',
}

const STATUS_MOVE_KEYWORDS = [
  'protect', 'toxic', 'will-o-wisp', 'thunder-wave', 'stealth-rock',
  'spikes', 'reflect', 'light-screen', 'tailwind', 'trick-room',
  'nasty-plot', 'swords-dance', 'calm-mind', 'recover', 'roost',
  'wish', 'substitute', 'encore', 'taunt', 'sleep-powder',
  'stun-spore', 'confuse-ray', 'yawn', 'gravity', 'trick',
  'switcheroo', 'memento', 'healing-wish', 'baton-pass',
]

function isStatusMove(moveName: string): boolean {
  return STATUS_MOVE_KEYWORDS.some((keyword) => moveName.toLowerCase().includes(keyword))
}

// ============================================================
// Individual Rule Functions
// ============================================================

/** Rule 1: Total EVs must not exceed 510 */
function checkTotalEVs(build: PokemonBuild): ValidationResult | null {
  const total = Object.values(build.stats).reduce((sum, s) => sum + s.ev, 0)
  if (total > STAT_LIMITS.EV_TOTAL_MAX) {
    return {
      id: 'ev-total',
      severity: 'error',
      field: 'stats',
      message: `EVs totales: ${total} / ${STAT_LIMITS.EV_TOTAL_MAX}. ¡Excede el límite!`,
    }
  }
  return null
}

/** Rule 2: Each individual EV must be ≤ 252 */
function checkIndividualEVs(build: PokemonBuild): ValidationResult[] {
  const results: ValidationResult[] = []
  for (const [key, val] of Object.entries(build.stats) as [keyof PokemonStats, { iv: number; ev: number }][]) {
    if (val.ev > STAT_LIMITS.EV_MAX) {
      results.push({
        id: `ev-${key}`,
        severity: 'error',
        field: 'stats',
        message: `${STAT_LABELS[key]}: EV ${val.ev} supera el máximo (252)`,
      })
    }
  }
  return results
}

/** Rule 3: IVs must be between 0 and 31 */
function checkIVRange(build: PokemonBuild): ValidationResult[] {
  const results: ValidationResult[] = []
  for (const [key, val] of Object.entries(build.stats) as [keyof PokemonStats, { iv: number; ev: number }][]) {
    if (val.iv < STAT_LIMITS.IV_MIN || val.iv > STAT_LIMITS.IV_MAX) {
      results.push({
        id: `iv-${key}`,
        severity: 'error',
        field: 'stats',
        message: `${STAT_LABELS[key]}: IV ${val.iv} fuera de rango (0–31)`,
      })
    }
  }
  return results
}

/** Rule 4: Level must be between 1 and 100 */
function checkLevel(build: PokemonBuild): ValidationResult | null {
  if (build.level < 1 || build.level > 100) {
    return {
      id: 'level-range',
      severity: 'error',
      field: 'level',
      message: `Nivel ${build.level} fuera de rango (1–100)`,
    }
  }
  return null
}

/** Rule 5: At least one move must be selected */
function checkAtLeastOneMove(build: PokemonBuild): ValidationResult | null {
  const hasMove = build.moves.some((m) => m !== null)
  if (!hasMove) {
    return {
      id: 'moves-empty',
      severity: 'error',
      field: 'moves',
      message: 'Debe tener al menos un movimiento',
    }
  }
  return null
}

/** Rule 6: No duplicate moves across slots */
function checkDuplicateMoves(build: PokemonBuild): ValidationResult | null {
  const moveIds = build.moves.filter((m) => m !== null).map((m) => m!.id)
  const uniqueIds = new Set(moveIds)
  if (uniqueIds.size !== moveIds.length) {
    return {
      id: 'moves-duplicate',
      severity: 'error',
      field: 'moves',
      message: 'Hay movimientos duplicados en los slots',
    }
  }
  return null
}

/** Rule 7: Ability must be selected */
function checkAbility(build: PokemonBuild): ValidationResult | null {
  if (!build.ability || build.ability.trim() === '') {
    return {
      id: 'ability-missing',
      severity: 'error',
      field: 'ability',
      message: 'Debe seleccionar una habilidad',
    }
  }
  return null
}

/** Rule 8 (Warning): Genderless Pokémon should not have M/F gender */
function checkGenderCompatibility(build: PokemonBuild): ValidationResult | null {
  // Genderless species from PokeAPI have gender_rate == -1
  // We detect genderless by checking if all abilities are slot 1 only and checking the name
  // Simple heuristic: if user keeps "genderless" it's fine. Warn if they override to M/F
  // but only for Pokémon that are naturally genderless (we use a known list subset)
  const GENDERLESS_POKEMON = [
    'ditto', 'staryu', 'starmie', 'voltorb', 'electrode',
    'porygon', 'porygon2', 'porygon-z', 'magneton', 'magnezone',
    'magnemite', 'baltoy', 'claydol', 'metagross', 'metang', 'beldum',
    'bronzor', 'bronzong', 'mew', 'mewtwo', 'shedinja', 'solrock',
    'lunatone', 'klink', 'klang', 'klinklang', 'golett', 'golurk',
  ]
  if (
    GENDERLESS_POKEMON.includes(build.pokemon.name.toLowerCase()) &&
    build.gender !== 'genderless'
  ) {
    return {
      id: 'gender-genderless',
      severity: 'warning',
      field: 'gender',
      message: `${build.pokemon.name} es sin género por naturaleza`,
    }
  }
  return null
}

/** Rule 9 (Warning): Assault Vest + status move */
function checkAssaultVest(build: PokemonBuild): ValidationResult | null {
  if (build.heldItem !== 'Assault Vest') return null
  const hasStatusMove = build.moves.some((m) => m !== null && isStatusMove(m.name))
  if (hasStatusMove) {
    return {
      id: 'item-assault-vest',
      severity: 'warning',
      field: 'item',
      message: 'Assault Vest no permite movimientos de estado',
    }
  }
  return null
}

/** Rule 10 (Warning): Suspicious 0 IVs on HP or Attack without context */
function checkSuspiciousZeroIVs(build: PokemonBuild): ValidationResult | null {
  const hp = build.stats.hp.iv
  const atk = build.stats.attack.iv
  if (hp === 0 && atk === 0) {
    return {
      id: 'iv-zero-warning',
      severity: 'warning',
      field: 'stats',
      message: 'HP e IVs de ATK son 0. ¿Es intencional?',
    }
  }
  return null
}

/**
 * Rule 11 (Error): Ability is not one of the valid abilities for this species.
 * Uses the pokemon.abilities data already available in the build (from PokeAPI).
 */
function checkAbilityIsValid(build: PokemonBuild): ValidationResult | null {
  if (!build.ability || !build.pokemon?.abilities?.length) return null
  
  const validAbilities = build.pokemon.abilities.map((a) => a.ability.name)
  const selectedSlug = build.ability.toLowerCase().trim()
  
  if (!validAbilities.includes(selectedSlug)) {
    return {
      id: 'ability-invalid-for-species',
      severity: 'error',
      field: 'ability',
      message: `"${build.ability}" no es una habilidad válida para ${build.pokemon.name}. Válidas: ${validAbilities.join(', ')}`,
    }
  }
  return null
}

/**
 * Rule 12 (Warning): Hidden Ability may not be legal in all competitive formats.
 */
function checkHiddenAbility(build: PokemonBuild): ValidationResult | null {
  if (!build.ability || !build.pokemon?.abilities?.length) return null
  
  const selectedSlug = build.ability.toLowerCase().trim()
  const haEntry = build.pokemon.abilities.find(
    (a) => a.ability.name === selectedSlug && a.is_hidden
  )
  
  if (haEntry) {
    return {
      id: 'ability-hidden',
      severity: 'warning',
      field: 'ability',
      message: '⚠️ Habilidad Oculta (HA) — verifica que sea legal en el formato de tu torneo',
    }
  }
  return null
}

// ============================================================
// Main Validation Function
// ============================================================

export function validateBuild(build: PokemonBuild): ValidationResult[] {
  const results: ValidationResult[] = []

  const push = (r: ValidationResult | null) => r && results.push(r)
  const pushAll = (arr: ValidationResult[]) => results.push(...arr)

  push(checkTotalEVs(build))
  pushAll(checkIndividualEVs(build))
  pushAll(checkIVRange(build))
  push(checkLevel(build))
  push(checkAtLeastOneMove(build))
  push(checkDuplicateMoves(build))
  push(checkAbility(build))
  push(checkGenderCompatibility(build))
  push(checkAssaultVest(build))
  push(checkSuspiciousZeroIVs(build))
  push(checkAbilityIsValid(build))
  push(checkHiddenAbility(build))

  // Sort: errors first, then warnings
  return results.sort((a, b) => {
    if (a.severity === 'error' && b.severity === 'warning') return -1
    if (a.severity === 'warning' && b.severity === 'error') return 1
    return 0
  })
}

export function isBuildLegal(results: ValidationResult[]): boolean {
  return results.every((r) => r.severity !== 'error')
}
