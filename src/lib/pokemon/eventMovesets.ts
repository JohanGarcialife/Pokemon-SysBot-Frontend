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
}
