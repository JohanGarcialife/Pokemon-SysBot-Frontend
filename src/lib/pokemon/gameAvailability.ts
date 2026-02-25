/**
 * gameAvailability.ts
 *
 * Checks whether a Pokémon species is available in a given game version
 * by fetching PokeAPI Pokédex data and caching it in memory.
 */

import { GameVersion } from './types'

// ─── PokeAPI Pokédex IDs per game ────────────────────────────────────────────
//
// Each entry maps to the PokeAPI pokedex numeric ID.
// Scarlet / Violet share the same three regional dexes.
// Legends: Z-A is a 2025 title — PokeAPI doesn't have its dex yet.
//
const GAME_POKEDEX_IDS: Partial<Record<GameVersion, number[]>> = {
  scarlet:     [27, 31, 32], // paldea, kitakami, blueberry
  violet:      [27, 31, 32],
  'legends-za': [],          // not yet in PokeAPI → treated as "unknown"
}

// ─── In-memory cache: GameVersion → Set of species names ────────────────────
const cache = new Map<GameVersion, Set<string>>()
const pendingFetches = new Map<GameVersion, Promise<Set<string>>>()

// ─── Internal helpers ────────────────────────────────────────────────────────

async function fetchPokedex(id: number): Promise<string[]> {
  const url = `https://pokeapi.co/api/v2/pokedex/${id}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PokeAPI pokedex ${id} returned ${res.status}`)
  const data = await res.json() as {
    pokemon_entries: { pokemon_species: { name: string } }[]
  }
  return data.pokemon_entries.map((e) => e.pokemon_species.name)
}

async function buildGameSet(game: GameVersion): Promise<Set<string>> {
  const ids = GAME_POKEDEX_IDS[game]
  if (!ids || ids.length === 0) return new Set() // empty = "unknown" game

  const results = await Promise.all(ids.map(fetchPokedex))
  const combined = new Set<string>()
  for (const names of results) {
    for (const name of names) combined.add(name)
  }
  return combined
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Preloads the game's Pokédex into cache.
 * Call this when a game is selected so later checks are instant.
 */
export async function preloadGamePokedex(game: GameVersion): Promise<void> {
  if (cache.has(game)) return // already cached
  const ids = GAME_POKEDEX_IDS[game]
  if (!ids || ids.length === 0) return // no data available

  if (!pendingFetches.has(game)) {
    const promise = buildGameSet(game).then((set) => {
      cache.set(game, set)
      pendingFetches.delete(game)
      return set
    })
    pendingFetches.set(game, promise)
  }
  await pendingFetches.get(game)
}

/**
 * Returns:
 *  - `true`  → Pokémon IS available in this game
 *  - `false` → Pokémon is NOT available in this game
 *  - `null`  → availability is unknown (game not in PokeAPI yet)
 */
export async function isPokemonInGame(
  speciesName: string,
  game: GameVersion
): Promise<boolean | null> {
  const ids = GAME_POKEDEX_IDS[game]
  if (!ids || ids.length === 0) return null // unknown game

  await preloadGamePokedex(game)
  const set = cache.get(game)
  if (!set) return null

  // PokeAPI uses lowercase hyphenated names: "charizard", "mr-mime", etc.
  const normalised = speciesName.toLowerCase().replace(/\s+/g, '-')
  return set.has(normalised)
}

/**
 * Returns a human-readable name for the game version.
 */
export function getGameDisplayName(game: GameVersion): string {
  const names: Record<GameVersion, string> = {
    scarlet:       'Pokémon Escarlata',
    violet:        'Pokémon Púrpura',
    'legends-za':  'Pokémon Legends: Z-A',
  }
  return names[game] ?? game
}
