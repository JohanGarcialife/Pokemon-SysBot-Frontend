import { PokemonBuild } from './types'

/**
 * Serialized representation of a PokemonBuild for the backend distribution system.
 * Uses plain primitives — safe to JSON.stringify and store in Supabase jsonb.
 */
export interface StatValues {
  hp: number
  attack: number
  defense: number
  spAttack: number
  spDefense: number
  speed: number
}

export interface PokemonBuildPayload {
  species: string
  level: number
  nature: string
  ability: string
  shiny: boolean
  gender: string
  heldItem: string
  teraType: string
  pokeball: string
  origin: string
  moves: string[]     // Non-null move names only
  ivs: StatValues
  evs: StatValues
}

/**
 * Converts a single PokemonBuild (rich frontend type) into a flat payload
 * ready to be stored in Supabase or sent to the distribution system.
 */
export function buildToPayload(build: PokemonBuild): PokemonBuildPayload {
  const ivs: StatValues = {
    hp: build.stats.hp.iv,
    attack: build.stats.attack.iv,
    defense: build.stats.defense.iv,
    spAttack: build.stats.spAttack.iv,
    spDefense: build.stats.spDefense.iv,
    speed: build.stats.speed.iv,
  }

  const evs: StatValues = {
    hp: build.stats.hp.ev,
    attack: build.stats.attack.ev,
    defense: build.stats.defense.ev,
    spAttack: build.stats.spAttack.ev,
    spDefense: build.stats.spDefense.ev,
    speed: build.stats.speed.ev,
  }

  const moves = build.moves
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .map((m) => m.name)

  return {
    species: build.pokemon.name,
    level: build.level,
    nature: build.nature.name,
    ability: build.ability,
    shiny: build.shiny,
    gender: build.gender,
    heldItem: build.heldItem,
    teraType: build.teraType,
    pokeball: build.pokeball,
    origin: build.origin,
    moves,
    ivs,
    evs,
  }
}

/**
 * Converts an entire team (array of PokemonBuild) to an array of payloads.
 */
export function teamToPayload(builds: PokemonBuild[]): PokemonBuildPayload[] {
  return builds.map(buildToPayload)
}
