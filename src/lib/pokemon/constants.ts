import { PokemonType, Nature } from './types'

// Naturalezas de Pokémon
export const NATURES: Nature[] = [
  // Neutral
  { name: 'Hardy', increase: null, decrease: null },
  { name: 'Docile', increase: null, decrease: null },
  { name: 'Serious', increase: null, decrease: null },
  { name: 'Bashful', increase: null, decrease: null },
  { name: 'Quirky', increase: null, decrease: null },
  
  // Attack +
  { name: 'Lonely', increase: 'attack', decrease: 'defense' },
  { name: 'Brave', increase: 'attack', decrease: 'speed' },
  { name: 'Adamant', increase: 'attack', decrease: 'spAttack' },
  { name: 'Naughty', increase: 'attack', decrease: 'spDefense' },
  
  // Defense +
  { name: 'Bold', increase: 'defense', decrease: 'attack' },
  { name: 'Relaxed', increase: 'defense', decrease: 'speed' },
  { name: 'Impish', increase: 'defense', decrease: 'spAttack' },
  { name: 'Lax', increase: 'defense', decrease: 'spDefense' },
  
  // Speed +
  { name: 'Timid', increase: 'speed', decrease: 'attack' },
  { name: 'Hasty', increase: 'speed', decrease: 'defense' },
  { name: 'Jolly', increase: 'speed', decrease: 'spAttack' },
  { name: 'Naive', increase: 'speed', decrease: 'spDefense' },
  
  // Sp. Attack +
  { name: 'Modest', increase: 'spAttack', decrease: 'attack' },
  { name: 'Mild', increase: 'spAttack', decrease: 'defense' },
  { name: 'Quiet', increase: 'spAttack', decrease: 'speed' },
  { name: 'Rash', increase: 'spAttack', decrease: 'spDefense' },
  
  // Sp. Defense +
  { name: 'Calm', increase: 'spDefense', decrease: 'attack' },
  { name: 'Gentle', increase: 'spDefense', decrease: 'defense' },
  { name: 'Sassy', increase: 'spDefense', decrease: 'speed' },
  { name: 'Careful', increase: 'spDefense', decrease: 'spAttack' },
]

// Teratipos (Gen 9 - Scarlet/Violet)
export const TERA_TYPES: string[] = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

// Colores para cada stat
export const STAT_COLORS = {
  hp: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500',
    gradient: 'from-red-400 to-red-600'
  },
  attack: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
  defense: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-500',
    border: 'border-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  spAttack: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    border: 'border-blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
  spDefense: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    border: 'border-green-500',
    gradient: 'from-green-400 to-green-600'
  },
  speed: {
    bg: 'bg-pink-500',
    text: 'text-pink-500',
    border: 'border-pink-500',
    gradient: 'from-pink-400 to-pink-600'
  }
} as const

// Labels de stats en español
export const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  spAttack: 'SP.ATK',
  spDefense: 'SP.DEF',
  speed: 'SPE'
} as const

// Límites de stats
export const STAT_LIMITS = {
  IV_MIN: 0,
  IV_MAX: 31,
  EV_MIN: 0,
  EV_MAX: 252,
  EV_TOTAL_MAX: 510
} as const

// Colores de tipos Pokémon (usando clases Tailwind estándar)
export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-400'
}
