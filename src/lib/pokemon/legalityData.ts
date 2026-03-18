import { GameVersion } from './types'

// ============================================================
// Tipos
// ============================================================

export interface OriginRules {
  shinyLocked: boolean
  alphaLocked?: boolean // Si también está alpha-locked
  minLevel: number
  fixedBall?: string
}

export interface PokemonSpeciesRules {
  shinyLocked?: boolean       // Shiny-locked en este juego (independiente del origen)
  alphaLocked?: boolean       // No puede ser Alpha en absoluto en este juego
  availableOrigins?: string[] // Si solo puede obtenerse por ciertos orígenes
  notAvailable?: boolean      // El Pokémon directamente no existe en este juego
}

export interface GameRules {
  disabledFeatures: string[]
  disabledOrigins: string[]
  origins: Record<string, OriginRules>
  pokemonRules: Record<string, PokemonSpeciesRules>  // Mapeo de slug de especie → reglas
}

// ============================================================
// LEGENDS: Z-A — Datos verificados (Octubre 2025)
// ============================================================

// Legendarios y míticos SHINY LOCKED en Z-A
// Fuentes: destructoid.com, insider-gaming.com, serebii.net
const LZA_SHINY_LOCKED_POKEMON: string[] = [
  // Sub-legendarios disponibles solo por historia/misión, sin shiny
  'xerneas', 'yveltal', 'zygarde',
  // Legendarios que vienen por misiones especiales o eventos de juego
  'mewtwo',      // Diciembre 2025 - via evento especial, shiny locked
  'meloetta',    // Hyperspace Distortion, shiny locked
  'keldeo',      // Hyperspace Distortion, shiny locked
  'volcanion',   // Hyperspace Distortion, shiny locked (necesita DLC Zone)
  'rayquaza',    // Hyperspace Distortion, shiny locked
  'groudon',     // Hyperspace Distortion, shiny locked
  'kyogre',      // Hyperspace Distortion, shiny locked
  'heatran',     // Hyperspace Distortion, shiny locked
  'darkrai',     // Hyperspace Distortion, shiny locked
  'genesect',    // Hyperspace Distortion, shiny locked
  'hoopa',       // DLC Mega Dimension, shiny locked
  'magearna',    // Hyperspace Distortion, shiny locked
  'marshadow',   // Hyperspace Distortion, shiny locked
  'zeraora',     // Hyperspace Distortion, shiny locked
  'meltan',      // Gift, shiny locked
  'melmetal',    // Gift (evolución de Meltan), shiny locked
  'diancie',     // Noviembre 2025 - evento, shiny locked
  // Iniciales elegidos al inicio del juego
  // (en wild pueden salir shiny, pero cuando son starters no)
  // Los incluimos especificando que si el origen es 'Starter', están shiny-locked
]

// Pokémon que no pueden ser Alpha en Z-A
// Fuente: serebii.net
const LZA_ALPHA_LOCKED_POKEMON: string[] = [
  'darkrai',
  'cobalion',
  'terrakion',
  // Todos los míticos que son exclusivos de Hyperspace/eventos no pueden ser Alpha
  'mewtwo', 'diancie', 'hoopa', 'volcanion', 'magearna', 'marshadow',
  'zeraora', 'meltan', 'melmetal', 'genesect', 'keldeo',
  'meloetta', 'rayquaza', 'groudon', 'kyogre', 'heatran',
  'xerneas', 'yveltal', 'zygarde',
]

// Pokémon de generaciones posteriores a 6 que NO ESTÁN en Z-A
// Z-A tiene ~230 pokémon centrados en Gen 1-6 principalmente
// Gen 7+ generalmente no están salvo excepciones (Meltan, Melmetal, Zeraora, Marshadow, Magearna)
const LZA_NOT_AVAILABLE_GEN7_PLUS: string[] = [
  // Gen 7 Legendarios/Míticos que SÍ están como excepción ya mencionados arriba
  // Gen 7 Pokémon normales que NO están
  'rowlet', 'dartrix', 'decidueye', 'litten', 'torracat', 'incineroar',
  'popplio', 'brionne', 'primarina', 'pikipek', 'trumbeak', 'toucannon',
  'yungoos', 'gumshoos', 'grubbin', 'charjabug', 'vikavolt', 'crabrawler',
  'crabominable', 'oricorio', 'cutiefly', 'ribombee', 'rockruff', 'lycanroc',
  'wishiwashi', 'mareanie', 'toxapex', 'mudbray', 'mudsdale', 'dewpider',
  'araquanid', 'fomantis', 'lurantis', 'morelull', 'shiinotic', 'salandit',
  'salazzle', 'stufful', 'bewear', 'bounsweet', 'steenee', 'tsareena',
  'comfey', 'oranguru', 'passimian', 'wimpod', 'golisopod', 'sandygast',
  'palossand', 'pyukumuku', 'type-null', 'silvally', 'minior', 'komala',
  'turtonator', 'togedemaru', 'mimikyu', 'bruxish', 'drampa', 'dhelmise',
  'jangmo-o', 'hakamo-o', 'kommo-o', 'tapu-koko', 'tapu-lele', 'tapu-bulu',
  'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'nihilego',
  'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord',
  'necrozma', 'poipole', 'naganadel', 'stakataka', 'blacephalon',
  // Gen 8 Pokémon (Galar) - generalmente no disponibles
  'grookey', 'thwackey', 'rillaboom', 'scorbunny', 'raboot', 'cinderace',
  'sobble', 'drizzile', 'inteleon', 'skwovet', 'greedent', 'rookidee',
  'corvisquire', 'corviknight', 'blipbug', 'dottler', 'orbeetle',
  'nickit', 'thievul', 'gossifleur', 'eldegoss', 'wooloo', 'dubwool',
  'chewtle', 'drednaw', 'yamper', 'boltund', 'rolycoly', 'carkol', 'coalossal',
  'applin', 'flapple', 'appletun', 'silicobra', 'sandaconda', 'cramorant',
  'arrokuda', 'barraskewda', 'toxel', 'toxtricity', 'sizzlipede', 'centiskorch',
  'clobbopus', 'grapploct', 'sinistea', 'polteageist', 'hatenna', 'hattrem',
  'hatterene', 'impidimp', 'morgrem', 'grimmsnarl', 'perrserker', 'cursola',
  'sirfetchd', 'mr-rime', 'runerigus', 'milcery', 'alcremie', 'falinks',
  'pincurchin', 'snom', 'frosmoth', 'stonjourner', 'eiscue', 'indeedee',
  'morpeko', 'cufant', 'copperajah', 'dracozolt', 'arctozolt', 'dracovish',
  'arctovish', 'duraludon', 'dreepy', 'drakloak', 'dragapult', 'zacian',
  'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'zarude', 'regieleki',
  'regidrago', 'glastrier', 'spectrier', 'calyrex', 'kleavor',
  // Gen 9 Pokémon (Paldea) - no disponibles en Z-A (son de Scarlet/Violet)
  'sprigatito', 'floragato', 'meowscarada', 'fuecoco', 'crocalor', 'skeledirge',
  'quaxly', 'quaxwell', 'quaquaval', 'lechonk', 'oinkologne', 'tarountula',
  'spidops', 'nymble', 'lokix', 'pawmi', 'pawmo', 'pawmot', 'tandemaus',
  'maushold', 'fidough', 'dachsbun', 'smoliv', 'dolliv', 'arboliva',
  'squawkabilly', 'nacli', 'naclstack', 'garganacl', 'charcadet', 'armarouge',
  'ceruledge', 'tadbulb', 'bellibolt', 'wattrel', 'kilowattrel', 'maschiff',
  'mabosstiff', 'shroodle', 'grafaiai', 'bramblin', 'brambleghast',
  'toedscool', 'toedscruel', 'klawf', 'capsakid', 'scovillain', 'rellor',
  'rabsca', 'flittle', 'espathra', 'tinkatink', 'tinkatuff', 'tinkaton',
  'wiglett', 'wugtrio', 'bombirdier', 'finizen', 'palafin', 'varoom',
  'revavroom', 'cyclizar', 'orthworm', 'glimmet', 'glimmora', 'greavard',
  'houndstone', 'flamigo', 'cetoddle', 'cetitan', 'veluza', 'dondozo',
  'tatsugiri', 'annihilape', 'clodsire', 'farigiraf', 'dudunsparce',
  'kingambit', 'great-tusk', 'scream-tail', 'brute-bonnet', 'flutter-mane',
  'slither-wing', 'sandy-shocks', 'iron-treads', 'iron-bundle', 'iron-hands',
  'iron-jugulis', 'iron-moth', 'iron-thorns', 'frigibax', 'arctibax',
  'baxcalibur', 'gimmighoul', 'gholdengo', 'wo-chien', 'chien-pao',
  'ting-lu', 'chi-yu', 'roaring-moon', 'iron-valiant', 'koraidon', 'miraidon',
  'walking-wake', 'iron-leaves', 'dipplin', 'poltchageist', 'sinistcha',
  'okidogi', 'munkidori', 'fezandipiti', 'ogerpon', 'archaludon',
  'hydrapple', 'gouging-fire', 'raging-bolt', 'iron-boulder', 'iron-crown',
  'terapagos', 'pecharunt',
]

// ============================================================
// SCARLET & VIOLET — Datos verificados
// ============================================================

// Pokémon míticos y legendarios shiny-locked en Scarlet/Violet
const SV_SHINY_LOCKED_POKEMON: string[] = [
  // Starter que recibes al inicio (wild sí pueden ser shiny)
  // Legendarios de la historia principal:
  'koraidon', 'miraidon',
  // Legendarios de DLC:
  'ogerpon',       // Story legendary - shiny locked
  'terapagos',     // Story legendary - shiny locked
  // Paradox legendarios:
  'walking-wake', 'iron-leaves', 'gouging-fire', 'raging-bolt', 'iron-boulder', 'iron-crown',
  // Míticos:
  'pecharunt',     // Event only, shiny locked
  // Ruinous quartet: pueden ser shiny en eventos específicos pero normalmente shiny-locked
  // en encuentro estático
  'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu',
]

// ============================================================
// REGLAS COMPLETAS POR JUEGO
// ============================================================

export const GAME_LEGALITY_RULES: Partial<Record<GameVersion, GameRules>> = {
  'legends-za': {
    disabledFeatures: ['teraType', 'evs'],
    disabledOrigins: ['Egg', 'Tera Raid'],
    origins: {
      'Wild Encounter': {
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
        alphaLocked: true,
        minLevel: 5,
        fixedBall: 'Poké Ball'
      },
      'Starter': {
        shinyLocked: true,
        alphaLocked: true,
        minLevel: 5,
        fixedBall: 'Poké Ball'
      },
      'Event': {
        shinyLocked: true,
        alphaLocked: true,
        minLevel: 10,
        fixedBall: 'Cherish Ball'
      },
    },
    pokemonRules: {
      // Shiny-locked en Z-A (todos estos están bloqueados independiente del origen)
      ...Object.fromEntries(
        LZA_SHINY_LOCKED_POKEMON.map((slug) => [
          slug,
          {
            shinyLocked: true,
            alphaLocked: LZA_ALPHA_LOCKED_POKEMON.includes(slug),
          } satisfies PokemonSpeciesRules,
        ])
      ),
      // Alpha-locked adicionales (que pueden ser shiny pero no Alpha)
      ...Object.fromEntries(
        LZA_ALPHA_LOCKED_POKEMON
          .filter((slug) => !LZA_SHINY_LOCKED_POKEMON.includes(slug))
          .map((slug) => [
            slug,
            { alphaLocked: true } satisfies PokemonSpeciesRules,
          ])
      ),
      // Pokémon no disponibles en Z-A
      ...Object.fromEntries(
        LZA_NOT_AVAILABLE_GEN7_PLUS.map((slug) => [
          slug,
          { notAvailable: true } satisfies PokemonSpeciesRules,
        ])
      ),
    },
  },

  scarlet: {
    disabledFeatures: [],
    disabledOrigins: [],
    origins: {
      'Wild Encounter':  { shinyLocked: false, minLevel: 1 },
      'Tera Raid':       { shinyLocked: false, minLevel: 1 },
      'Egg':             { shinyLocked: false, minLevel: 1 },
      'Mass Outbreak':   { shinyLocked: false, minLevel: 1 },
      'Trade':           { shinyLocked: false, minLevel: 1 },
      'In-Game Gift':    { shinyLocked: true, alphaLocked: true, minLevel: 1, fixedBall: 'Poké Ball' },
      'Starter':         { shinyLocked: true, alphaLocked: true, minLevel: 5, fixedBall: 'Poké Ball' },
      'Event':           { shinyLocked: true, alphaLocked: true, minLevel: 10, fixedBall: 'Cherish Ball' },
    },
    pokemonRules: {
      ...Object.fromEntries(
        SV_SHINY_LOCKED_POKEMON.map((slug) => [
          slug,
          { shinyLocked: true } satisfies PokemonSpeciesRules,
        ])
      ),
    },
  },

  violet: {
    disabledFeatures: [],
    disabledOrigins: [],
    origins: {
      'Wild Encounter':  { shinyLocked: false, minLevel: 1 },
      'Tera Raid':       { shinyLocked: false, minLevel: 1 },
      'Egg':             { shinyLocked: false, minLevel: 1 },
      'Mass Outbreak':   { shinyLocked: false, minLevel: 1 },
      'Trade':           { shinyLocked: false, minLevel: 1 },
      'In-Game Gift':    { shinyLocked: true, alphaLocked: true, minLevel: 1, fixedBall: 'Poké Ball' },
      'Starter':         { shinyLocked: true, alphaLocked: true, minLevel: 5, fixedBall: 'Poké Ball' },
      'Event':           { shinyLocked: true, alphaLocked: true, minLevel: 10, fixedBall: 'Cherish Ball' },
    },
    pokemonRules: {
      ...Object.fromEntries(
        SV_SHINY_LOCKED_POKEMON.map((slug) => [
          slug,
          { shinyLocked: true } satisfies PokemonSpeciesRules,
        ])
      ),
    },
  },
}
