/**
 * eventMovesets.ts — Official movesets for shiny-event-only Pokémon.
 *
 * These are the moves distributed with the official Mystery Gift events.
 * When a user selects Shiny for one of these Pokémon, moves are auto-filled
 * from this table and locked so the user cannot change them.
 *
 * Sources:
 *   - Serebii.net event database (https://www.serebii.net/events/)
 *   - Bulbapedia Mystery Gift distributions
 *
 * Move names use lowercase-hyphenated PokeAPI format.
 * Only the most recent / most relevant shiny event is listed per species.
 */

export interface EventMoveset {
  /** Display label shown in the UI */
  eventName: string
  /** Year of the event */
  year: number
  /** Moves in order (up to 4). Use null for empty slots. */
  moves: [string, string, string, string]
  /** Official level of the event Pokémon */
  level: number
  /** Nature of the event Pokémon (PokeAPI lowercase) */
  nature: string
  /** Ability (PokeAPI slug) */
  ability: string
}

/**
 * Map from PokeAPI species slug → event moveset.
 * Only Pokémon that exist as shiny EXCLUSIVELY via event are listed here.
 */
export const EVENT_MOVESETS: Record<string, EventMoveset> = {
  // ── SV ──────────────────────────────────────────────────────────────────────
  koraidon: {
    eventName: 'Tera Raid Event (Pokémon Presents 2023)',
    year: 2023,
    level: 100,
    nature: 'adamant',
    ability: 'orichalcum-pulse',
    moves: ['collision-course', 'close-combat', 'flare-blitz', 'outrage'],
  },
  miraidon: {
    eventName: 'Tera Raid Event (Pokémon Presents 2023)',
    year: 2023,
    level: 100,
    nature: 'modest',
    ability: 'hadron-engine',
    moves: ['electro-drift', 'draco-meteor', 'parabolic-charge', 'charge'],
  },

  // ── Zygarde (via HOME / Legends Z-A) ────────────────────────────────────────
  zygarde: {
    eventName: 'Pokémon Legends Z-A HOME Gift (2025)',
    year: 2025,
    level: 100,
    nature: 'jolly',
    ability: 'power-construct',
    moves: ['core-enforcer', 'thousand-arrows', 'extreme-speed', 'coil'],
  },
  'zygarde-50%': {
    eventName: 'Pokémon Legends Z-A HOME Gift (2025)',
    year: 2025,
    level: 100,
    nature: 'jolly',
    ability: 'power-construct',
    moves: ['core-enforcer', 'thousand-arrows', 'extreme-speed', 'coil'],
  },
  'zygarde-10': {
    eventName: 'Pokémon Legends Z-A HOME Gift — 10% Forme (2025)',
    year: 2025,
    level: 100,
    nature: 'jolly',
    ability: 'power-construct',
    moves: ['core-enforcer', 'thousand-arrows', 'extreme-speed', 'coil'],
  },
  'zygarde-10%': {
    eventName: 'Pokémon Legends Z-A HOME Gift — 10% Forme (2025)',
    year: 2025,
    level: 100,
    nature: 'jolly',
    ability: 'power-construct',
    moves: ['core-enforcer', 'thousand-arrows', 'extreme-speed', 'coil'],
  },
  'zygarde-complete': {
    eventName: 'Pokémon Legends Z-A HOME Gift — Complete Forme (2025)',
    year: 2025,
    level: 100,
    nature: 'jolly',
    ability: 'power-construct',
    moves: ['core-enforcer', 'thousand-arrows', 'extreme-speed', 'coil'],
  },

  // ── Gen 6 Mythicals ─────────────────────────────────────────────────────────
  diancie: {
    eventName: 'Diancie Shiny Event (2015)',
    year: 2015,
    level: 50,
    nature: 'bold',
    ability: 'clear-body',
    moves: ['diamond-storm', 'moonblast', 'protect', 'reflect'],
  },
  hoopa: {
    eventName: 'Hoopa Event (2015)',
    year: 2015,
    level: 50,
    nature: 'bold',
    ability: 'magician',
    moves: ['hyperspace-hole', 'psychic', 'astonish', 'nasty-plot'],
  },
  volcanion: {
    eventName: 'Volcanion Event (2016)',
    year: 2016,
    level: 70,
    nature: 'modest',
    ability: 'water-absorb',
    moves: ['steam-eruption', 'flamethrower', 'hydro-pump', 'explosion'],
  },

  // ── Gen 7 Mythicals ─────────────────────────────────────────────────────────
  marshadow: {
    eventName: 'Marshadow Event (2017)',
    year: 2017,
    level: 50,
    nature: 'jolly',
    ability: 'technician',
    moves: ['spectral-thief', 'close-combat', 'force-palm', 'shadow-ball'],
  },
  zeraora: {
    eventName: 'Zeraora Shiny HOME Gift (2020)',
    year: 2020,
    level: 100,
    nature: 'jolly',
    ability: 'volt-absorb',
    moves: ['plasma-fists', 'close-combat', 'thunder-punch', 'bulk-up'],
  },
  meltan: {
    eventName: 'Meltan HOME Gift',
    year: 2019,
    level: 1,
    nature: 'hardy',
    ability: 'magnet-pull',
    moves: ['thunder-shock', 'acid', 'headbutt', 'harden'],
  },
  melmetal: {
    eventName: 'Melmetal Shiny HOME Gift (2020)',
    year: 2020,
    level: 100,
    nature: 'adamant',
    ability: 'iron-fist',
    moves: ['double-iron-bash', 'earthquake', 'ice-punch', 'thunder-punch'],
  },
  magearna: {
    eventName: 'Magearna Original Color HOME Gift',
    year: 2021,
    level: 50,
    nature: 'serious',
    ability: 'soul-heart',
    moves: ['fleur-cannon', 'flash-cannon', 'aura-sphere', 'calm-mind'],
  },

  // ── Gen 5 Mythicals ─────────────────────────────────────────────────────────
  genesect: {
    eventName: 'Genesect Shiny Event (2013)',
    year: 2013,
    level: 100,
    nature: 'hasty',
    ability: 'download',
    moves: ['techno-blast', 'extreme-speed', 'blaze-kick', 'shift-gear'],
  },
  meloetta: {
    eventName: 'Meloetta Event (2013)',
    year: 2013,
    level: 50,
    nature: 'serious',
    ability: 'serene-grace',
    moves: ['relic-song', 'psychic', 'close-combat', 'hyper-voice'],
  },
  keldeo: {
    eventName: 'Keldeo Resolute Form Event (2013)',
    year: 2013,
    level: 100,
    nature: 'timid',
    ability: 'justified',
    moves: ['secret-sword', 'hydro-pump', 'close-combat', 'calm-mind'],
  },
  victini: {
    eventName: 'Liberty Garden Event (2011)',
    year: 2011,
    level: 15,
    nature: 'jolly',
    ability: 'victory-star',
    moves: ['confusion', 'endure', 'incinerate', 'quick-attack'],
  },

  // ── Gen 4 Mythicals ─────────────────────────────────────────────────────────
  darkrai: {
    eventName: 'Darkrai HOME Gift (2023)',
    year: 2023,
    level: 50,
    nature: 'timid',
    ability: 'bad-dreams',
    moves: ['dark-void', 'dark-pulse', 'dream-eater', 'nasty-plot'],
  },
  shaymin: {
    eventName: 'Shaymin Event (2009)',
    year: 2009,
    level: 100,
    nature: 'modest',
    ability: 'natural-cure',
    moves: ['seed-flare', 'aromatherapy', 'substitute', 'leech-seed'],
  },
  arceus: {
    eventName: 'Arceus HOME Gift (2022)',
    year: 2022,
    level: 100,
    nature: 'hardy',
    ability: 'multitype',
    moves: ['judgment', 'recover', 'swords-dance', 'extreme-speed'],
  },

  // ── Legends: Z-A — HOME Shiny Gifts ─────────────────────────────────────────
  // These legendaries are capturable non-shiny in Z-A, but their shiny forms
  // come exclusively from Pokémon HOME distribution events with a fixed set.
  groudon: {
    eventName: 'Groudon Shiny HOME Gift — Leyendas Z-A (2025)',
    year: 2025,
    level: 70,
    nature: 'adamant',
    ability: 'drought',
    moves: ['precipice-blades', 'fire-punch', 'solar-beam', 'swords-dance'],
  },
  kyogre: {
    eventName: 'Kyogre Shiny HOME Gift — Leyendas Z-A (2025)',
    year: 2025,
    level: 70,
    nature: 'modest',
    ability: 'drizzle',
    moves: ['origin-pulse', 'thunder', 'blizzard', 'calm-mind'],
  },
  rayquaza: {
    eventName: 'Rayquaza Shiny HOME Gift — Leyendas Z-A (2025)',
    year: 2025,
    level: 70,
    nature: 'rash',
    ability: 'air-lock',
    moves: ['dragon-ascent', 'draco-meteor', 'extreme-speed', 'earthquake'],
  },
}

/**
 * LEGENDARY_PRESETS — Fixed configurations for in-game legendary Pokémon.
 *
 * These Pokémon are obtainable by capturing in-game but ALM/PKHeX requires
 * very specific parameters to validate them as legal. Users cannot freely
 * edit their stats or moves.
 *
 * Key difference from EVENT_MOVESETS:
 *  - EVENT_MOVESETS = only shiny-locked + only via Mystery Gift
 *  - LEGENDARY_PRESETS = in-game capture, but fixed set required for legality
 */
export interface LegendaryPreset {
  label: string
  level: number
  nature: string
  ability: string
  moves: [string, string, string, string]
  /** Whether shiny is allowed for this Pokémon in this game */
  shinyAllowed: boolean
  /** The origin to force */
  forcedOrigin: string
  /** The ball to force */
  forcedBall: string
  /** If true, ALL fields are read-only (level, nature, ability, moves, ball, origin) */
  fullyLocked: boolean
}

export const LEGENDARY_PRESETS: Record<string, LegendaryPreset> = {
  // ── Scarlet / Violet ────────────────────────────────────────────────────────
  terapagos: {
    label: 'Terapagos — Captura en Zero Lab',
    level: 85,
    nature: 'timid',
    ability: 'tera-shift',
    moves: ['tera-starstorm', 'earth-power', 'calm-mind', 'protect'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  'walking-wake': {
    label: 'Walking Wake — Tera Raid 7★',
    level: 100,
    nature: 'timid',
    ability: 'protosynthesis',
    moves: ['hydro-steam', 'draco-meteor', 'flamethrower', 'noble-roar'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  'iron-leaves': {
    label: 'Iron Leaves — Tera Raid 7★',
    level: 100,
    nature: 'jolly',
    ability: 'quark-drive',
    moves: ['psyblade', 'close-combat', 'leaf-blade', 'swords-dance'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  'gouging-fire': {
    label: 'Gouging Fire — DLC Area Zero',
    level: 72,
    nature: 'adamant',
    ability: 'protosynthesis',
    moves: ['burning-bulwark', 'heat-crash', 'dragon-dance', 'flare-blitz'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  'raging-bolt': {
    label: 'Raging Bolt — DLC Area Zero',
    level: 72,
    nature: 'modest',
    ability: 'protosynthesis',
    moves: ['thunderclap', 'dragon-pulse', 'calm-mind', 'ancient-power'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  'iron-boulder': {
    label: 'Iron Boulder — DLC Area Zero',
    level: 72,
    nature: 'jolly',
    ability: 'quark-drive',
    moves: ['mighty-cleave', 'sacred-sword', 'stone-axe', 'swords-dance'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  'iron-crown': {
    label: 'Iron Crown — DLC Area Zero',
    level: 72,
    nature: 'modest',
    ability: 'quark-drive',
    moves: ['tachyon-cutter', 'calm-mind', 'flash-cannon', 'psychic'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },

  // ── Legends: Z-A ────────────────────────────────────────────────────────────
  rayquaza: {
    label: 'Rayquaza — Captura en Leyendas Z-A',
    level: 70,
    nature: 'rash',
    ability: 'air-lock',
    moves: ['dragon-ascent', 'draco-meteor', 'extreme-speed', 'earthquake'],
    shinyAllowed: true,    // shiny available via HOME event (different preset auto-applied)
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  groudon: {
    label: 'Groudon — Captura en Leyendas Z-A',
    level: 70,
    nature: 'adamant',
    ability: 'drought',
    moves: ['precipice-blades', 'fire-punch', 'swords-dance', 'roar-of-time'],
    shinyAllowed: true,    // shiny available via HOME event
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  kyogre: {
    label: 'Kyogre — Captura en Leyendas Z-A',
    level: 70,
    nature: 'modest',
    ability: 'drizzle',
    moves: ['origin-pulse', 'thunder', 'ice-beam', 'calm-mind'],
    shinyAllowed: true,    // shiny available via HOME event
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  heatran: {
    label: 'Heatran — Captura en Leyendas Z-A',
    level: 70,
    nature: 'modest',
    ability: 'flash-fire',
    moves: ['magma-storm', 'earth-power', 'flash-cannon', 'stealth-rock'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  // Latios/Latias can be shiny (wild encounter in Z-A)
  latios: {
    label: 'Latios — Captura en Leyendas Z-A',
    level: 60,
    nature: 'timid',
    ability: 'levitate',
    moves: ['luster-purge', 'draco-meteor', 'psychic', 'recover'],
    shinyAllowed: true,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  latias: {
    label: 'Latias — Captura en Leyendas Z-A',
    level: 60,
    nature: 'timid',
    ability: 'levitate',
    moves: ['mist-ball', 'draco-meteor', 'psychic', 'recover'],
    shinyAllowed: true,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  cobalion: {
    label: 'Cobalion — Captura en Leyendas Z-A',
    level: 65,
    nature: 'jolly',
    ability: 'justified',
    moves: ['sacred-sword', 'iron-head', 'close-combat', 'swords-dance'],
    shinyAllowed: true,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  virizion: {
    label: 'Virizion — Captura en Leyendas Z-A',
    level: 65,
    nature: 'jolly',
    ability: 'justified',
    moves: ['sacred-sword', 'leaf-blade', 'close-combat', 'swords-dance'],
    shinyAllowed: true,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  terrakion: {
    label: 'Terrakion — Captura en Leyendas Z-A',
    level: 65,
    nature: 'jolly',
    ability: 'justified',
    moves: ['sacred-sword', 'stone-edge', 'close-combat', 'swords-dance'],
    shinyAllowed: true,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  mewtwo: {
    label: 'Mewtwo — Captura en Leyendas Z-A',
    level: 70,
    nature: 'timid',
    ability: 'pressure',
    moves: ['psystrike', 'ice-beam', 'thunderbolt', 'nasty-plot'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  xerneas: {
    label: 'Xerneas — Captura en Leyendas Z-A',
    level: 70,
    nature: 'modest',
    ability: 'fairy-aura',
    moves: ['geomancy', 'moonblast', 'focus-blast', 'thunder'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  yveltal: {
    label: 'Yveltal — Captura en Leyendas Z-A',
    level: 70,
    nature: 'timid',
    ability: 'dark-aura',
    moves: ['oblivion-wing', 'dark-pulse', 'foul-play', 'sucker-punch'],
    shinyAllowed: false,
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
  // Genesect is capturable in Z-A (not event-only). Shiny via 2013 JP HOME event.
  genesect: {
    label: 'Genesect — Captura en Leyendas Z-A',
    level: 60,
    nature: 'hasty',
    ability: 'download',
    moves: ['techno-blast', 'extreme-speed', 'x-scissor', 'metal-claw'],
    shinyAllowed: true,    // shiny from the 2013 JP event (already in EVENT_MOVESETS)
    forcedOrigin: 'Wild Encounter',
    forcedBall: 'Poké Ball',
    fullyLocked: true,
  },
}
