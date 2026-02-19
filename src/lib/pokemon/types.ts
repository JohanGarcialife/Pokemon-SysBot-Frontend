// Tipos de PokeAPI y aplicación

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  front_female: string | null
  front_shiny_female: string | null
  back_default: string | null
  back_shiny: string | null
  other?: {
    'official-artwork': {
      front_default: string
      front_shiny: string
    }
    home?: {
      front_default: string
      front_shiny: string
    }
  }
}

export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonMove {
  move: {
    name: string
    url: string
  }
  version_group_details: {
    level_learned_at: number
    move_learn_method: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }[]
}

export interface Pokemon {
  id: number
  name: string
  species: {
    name: string
    url: string
  }
  sprites: PokemonSprites
  types: PokemonType[]
  abilities: PokemonAbility[]
  moves: PokemonMove[]
  stats: PokemonStat[]
  height: number
  weight: number
  base_experience: number
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

// Tipos de la aplicación

export type GameVersion = 'scarlet' | 'violet'

export interface TeamSlot {
  position: number
  pokemon: Pokemon | null
}

export interface Team {
  id: string
  name: string
  slots: TeamSlot[]
  game: GameVersion
  createdAt: Date
  updatedAt: Date
}

export interface PokemonSearchResult {
  id: number
  name: string
  sprite: string
}

// Tipos de Pokémon por generación
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#FF6B35',
  water: '#00D9FF',
  electric: '#FFCC00',
  grass: '#10B981',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
}

// ========================================
// POKEMON BUILDER TYPES
// ========================================

export interface PokemonStats {
  hp: StatValue
  attack: StatValue
  defense: StatValue
  spAttack: StatValue
  spDefense: StatValue
  speed: StatValue
}

export interface StatValue {
  iv: number  // 0-31
  ev: number  // 0-252
}

export interface Nature {
  name: string
  increase: keyof PokemonStats | null
  decrease: keyof PokemonStats | null
}

export interface Move {
  id: number
  name: string
  type: string
  power: number | null
  accuracy: number | null
  pp: number
  damageClass: 'physical' | 'special' | 'status'
  description?: string
}

export interface PokemonBuild {
  pokemon: Pokemon
  stats: PokemonStats
  nature: Nature
  teraType: string
  ability: string
  moves: (Move | null)[]  // Array de 4
  shiny: boolean
  gender: 'male' | 'female' | 'genderless'
  level: number
  pokeball: string
  heldItem: string
  origin: string
}

