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
  // Solo mantenemos los que JAMÁS han sido shiny legalmente en ningún juego
  'meloetta',
  'keldeo',
  'hoopa',
  'magearna',
  'marshadow',
]

// Pokémon que no pueden ser Alpha en Z-A
// Fuente: serebii.net
const LZA_ALPHA_LOCKED_POKEMON: string[] = [
  'darkrai',
  'cobalion',
  'terrakion',
  'mewtwo', 'diancie', 'hoopa', 'volcanion', 'magearna', 'marshadow',
  'zeraora', 'meltan', 'melmetal', 'genesect', 'keldeo',
  'meloetta', 'rayquaza', 'groudon', 'kyogre', 'heatran',
  'xerneas', 'yveltal', 'zygarde', 'zygarde-10', 'zygarde-10%', 'zygarde-50%', 'zygarde-complete',
]

// Pokémon de Gen 1-6 que son Legendarios/Míticos y NO ESTÁN en Z-A
// + Pokémon de generaciones posteriores a 6 que NO ESTÁN en Z-A
const LZA_NOT_AVAILABLE_POKEMON: string[] = [
  // Legendarios / Míticos de Gen 1-6 que NO están en Z-A
  'articuno', 'zapdos', 'moltres', 'mew',
  'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi',
  'regirock', 'regice', 'registeel', 'jirachi', 'deoxys',
  'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'cresselia', 'phione', 'manaphy', 'shaymin', 'arceus',
  'victini', 'tornadus', 'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem',
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
  'tapu-fini',
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
        shinyLocked: false,
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
        LZA_NOT_AVAILABLE_POKEMON.map((slug) => [
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
      'Event':           { shinyLocked: false, alphaLocked: true, minLevel: 10, fixedBall: 'Cherish Ball' },
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
      'Event':           { shinyLocked: false, alphaLocked: true, minLevel: 10, fixedBall: 'Cherish Ball' },
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
