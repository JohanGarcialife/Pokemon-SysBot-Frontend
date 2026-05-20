import { PokemonType, Nature } from './types'

// Naturalezas de Pokémon
export const NATURES: Nature[] = [
  // Neutral
  { name: 'Hardy', label: 'Fuerte', increase: null, decrease: null },
  { name: 'Docile', label: 'Dócil', increase: null, decrease: null },
  { name: 'Serious', label: 'Seria', increase: null, decrease: null },
  { name: 'Bashful', label: 'Tímida', increase: null, decrease: null },
  { name: 'Quirky', label: 'Rara', increase: null, decrease: null },
  
  // Attack +
  { name: 'Lonely', label: 'Huraña', increase: 'attack', decrease: 'defense' },
  { name: 'Brave', label: 'Audaz', increase: 'attack', decrease: 'speed' },
  { name: 'Adamant', label: 'Firme', increase: 'attack', decrease: 'spAttack' },
  { name: 'Naughty', label: 'Pícara', increase: 'attack', decrease: 'spDefense' },
  
  // Defense +
  { name: 'Bold', label: 'Osada', increase: 'defense', decrease: 'attack' },
  { name: 'Relaxed', label: 'Plácida', increase: 'defense', decrease: 'speed' },
  { name: 'Impish', label: 'Agitada', increase: 'defense', decrease: 'spAttack' },
  { name: 'Lax', label: 'Floja', increase: 'defense', decrease: 'spDefense' },
  
  // Speed +
  { name: 'Timid', label: 'Miedosa', increase: 'speed', decrease: 'attack' },
  { name: 'Hasty', label: 'Activa', increase: 'speed', decrease: 'defense' },
  { name: 'Jolly', label: 'Alegre', increase: 'speed', decrease: 'spAttack' },
  { name: 'Naive', label: 'Ingenua', increase: 'speed', decrease: 'spDefense' },
  
  // Sp. Attack +
  { name: 'Modest', label: 'Modesta', increase: 'spAttack', decrease: 'attack' },
  { name: 'Mild', label: 'Afable', increase: 'spAttack', decrease: 'defense' },
  { name: 'Quiet', label: 'Mansa', increase: 'spAttack', decrease: 'speed' },
  { name: 'Rash', label: 'Alocada', increase: 'spAttack', decrease: 'spDefense' },
  
  // Sp. Defense +
  { name: 'Calm', label: 'Serena', increase: 'spDefense', decrease: 'attack' },
  { name: 'Gentle', label: 'Amable', increase: 'spDefense', decrease: 'defense' },
  { name: 'Sassy', label: 'Grosera', increase: 'spDefense', decrease: 'speed' },
  { name: 'Careful', label: 'Cauta', increase: 'spDefense', decrease: 'spAttack' },
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

// Traducciones de Tipos al Español
export const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
}

// Poké Balls disponibles en Scarlet/Violet
export const POKE_BALLS = [
  { name: 'Poké Ball', label: 'Poké Ball', emoji: '🔴' },
  { name: 'Great Ball', label: 'Super Ball', emoji: '🔵' },
  { name: 'Ultra Ball', label: 'Ultra Ball', emoji: '🟡' },
  { name: 'Master Ball', label: 'Master Ball', emoji: '🟣' },
  { name: 'Net Ball', label: 'Malla Ball', emoji: '🕸️' },
  { name: 'Dive Ball', label: 'Buceo Ball', emoji: '💧' },
  { name: 'Nest Ball', label: 'Nido Ball', emoji: '🟢' },
  { name: 'Repeat Ball', label: 'Acopio Ball', emoji: '🔄' },
  { name: 'Timer Ball', label: 'Turno Ball', emoji: '⏱️' },
  { name: 'Luxury Ball', label: 'Lujo Ball', emoji: '✨' },
  { name: 'Premier Ball', label: 'Honor Ball', emoji: '⚪' },
  { name: 'Dusk Ball', label: 'Ocaso Ball', emoji: '🌑' },
  { name: 'Heal Ball', label: 'Sana Ball', emoji: '💗' },
  { name: 'Quick Ball', label: 'Veloz Ball', emoji: '⚡' },
  { name: 'Level Ball', label: 'Nivel Ball', emoji: '🎚️' },
  { name: 'Lure Ball', label: 'Cebo Ball', emoji: '🎣' },
  { name: 'Moon Ball', label: 'Luna Ball', emoji: '🌙' },
  { name: 'Friend Ball', label: 'Amigo Ball', emoji: '💚' },
  { name: 'Love Ball', label: 'Amor Ball', emoji: '💕' },
  { name: 'Heavy Ball', label: 'Peso Ball', emoji: '🏋️' },
  { name: 'Fast Ball', label: 'Rapid Ball', emoji: '💨' },
  { name: 'Dream Ball', label: 'Ensueño Ball', emoji: '💭' },
  { name: 'Beast Ball', label: 'Ente Ball', emoji: '👾' },
  { name: 'Sport Ball', label: 'Competi Ball', emoji: '🏀' },
  { name: 'Safari Ball', label: 'Safari Ball', emoji: '🌿' },
]

// Objetos equipables competitivos
export interface HeldItemData {
  name: string
  category: 'competitive' | 'berry' | 'evolution' | 'other'
  description: string
}

export const HELD_ITEMS: HeldItemData[] = [
  // Competitive
  { name: 'Choice Band', category: 'competitive', description: 'Sube Ataque 50% pero bloquea un movimiento' },
  { name: 'Choice Specs', category: 'competitive', description: 'Sube At.Esp 50% pero bloquea un movimiento' },
  { name: 'Choice Scarf', category: 'competitive', description: 'Sube Velocidad 50% pero bloquea un movimiento' },
  { name: 'Life Orb', category: 'competitive', description: 'Sube daño 30% pero pierde HP cada turno' },
  { name: 'Leftovers', category: 'competitive', description: 'Recupera 1/16 HP cada turno' },
  { name: 'Focus Sash', category: 'competitive', description: 'Sobrevive un golpe letal con 1 HP' },
  { name: 'Assault Vest', category: 'competitive', description: 'Sube Def.Esp 50% pero no puede usar movimientos de estado' },
  { name: 'Rocky Helmet', category: 'competitive', description: 'Daña al atacante que hace contacto' },
  { name: 'Heavy-Duty Boots', category: 'competitive', description: 'Inmune a entry hazards' },
  { name: 'Eviolite', category: 'competitive', description: 'Sube Def y Def.Esp 50% en Pokémon no evolucionados' },
  { name: 'Black Sludge', category: 'competitive', description: 'Recupera HP si es tipo Veneno' },
  { name: 'Flame Orb', category: 'competitive', description: 'Quema al portador (activa Guts/Facade)' },
  { name: 'Toxic Orb', category: 'competitive', description: 'Envenena al portador (activa Poison Heal)' },
  { name: 'Expert Belt', category: 'competitive', description: 'Sube daño super efectivo 20%' },
  { name: 'Weakness Policy', category: 'competitive', description: 'Sube ATK y SP.ATK al recibir golpe super efectivo' },
  { name: 'Air Balloon', category: 'competitive', description: 'Inmune a Tierra hasta recibir daño' },
  { name: 'Safety Goggles', category: 'competitive', description: 'Inmune a clima y movimientos de polvo' },
  { name: 'Covert Cloak', category: 'competitive', description: 'Inmune a efectos secundarios' },
  { name: 'Clear Amulet', category: 'competitive', description: 'Previene reducción de stats' },
  { name: 'Loaded Dice', category: 'competitive', description: 'Golpes múltiples conectan más veces' },
  { name: 'Booster Energy', category: 'competitive', description: 'Activa habilidad Paradox' },
  { name: 'Mirror Herb', category: 'competitive', description: 'Copia las subidas de stats del rival' },
  { name: 'Scope Lens', category: 'competitive', description: 'Aumenta ratio de golpe crítico' },
  // Berries
  { name: 'Sitrus Berry', category: 'berry', description: 'Recupera 25% HP cuando baja de 50%' },
  { name: 'Lum Berry', category: 'berry', description: 'Cura cualquier problema de estado' },
  { name: 'Yache Berry', category: 'berry', description: 'Reduce daño super efectivo de Hielo' },
  { name: 'Shuca Berry', category: 'berry', description: 'Reduce daño super efectivo de Tierra' },
  { name: 'Chople Berry', category: 'berry', description: 'Reduce daño super efectivo de Lucha' },
  { name: 'Aguav Berry', category: 'berry', description: 'Recupera 33% HP (confunde si -Def.Esp)' },
  // Other
  { name: 'Light Clay', category: 'other', description: 'Extiende pantallas a 8 turnos' },
  { name: 'Terrain Extender', category: 'other', description: 'Extiende terrenos a 8 turnos' },
  { name: 'Red Card', category: 'other', description: 'Fuerza cambio del rival al recibir daño' },
  { name: 'Eject Button', category: 'other', description: 'Cambia al portador al recibir daño' },
  { name: 'Eject Pack', category: 'other', description: 'Cambia si las stats bajan' },
  { name: 'Shed Shell', category: 'other', description: 'Permite cambiar aunque esté atrapado' },
  { name: 'Ability Shield', category: 'other', description: 'Protege la habilidad de ser cambiada' },
  { name: 'None', category: 'other', description: 'Sin objeto equipado' },
]

// Orígenes legales del Pokémon
export const ORIGINS = [
  { name: 'Wild Encounter', label: 'Encuentro Salvaje', emoji: '🌿', description: 'Capturado en la naturaleza' },
  { name: 'Tera Raid', label: 'Teraincursión', emoji: '💎', description: 'Obtenido en Teraincursión' },
  { name: 'Egg', label: 'Huevo', emoji: '🥚', description: 'Nacido de un huevo' },
  { name: 'Trade', label: 'Intercambio', emoji: '🔄', description: 'Recibido por intercambio' },
  { name: 'Event', label: 'Evento', emoji: '🎁', description: 'Distribución de evento especial' },
  { name: 'Mass Outbreak', label: 'Aparición Masiva', emoji: '🔥', description: 'Capturado en aparición masiva' },
  { name: 'Starter', label: 'Inicial', emoji: '⭐', description: 'Pokémon inicial del juego' },
  { name: 'In-Game Gift', label: 'Regalo', emoji: '🎀', description: 'Recibido como regalo en el juego' },
  { name: 'Pokémon HOME', label: 'Pokémon HOME', emoji: '🏠', description: 'Transferencia externa segura' },
]
