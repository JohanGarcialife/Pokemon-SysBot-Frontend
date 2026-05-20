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
  alpha: boolean
  gender: string
  heldItem: string
  teraType: string
  pokeball: string
  origin: string
  moves: string[]
  ivs: StatValues
  evs: StatValues
}

const LEGENDS_ZA_GAME = 'legends-za'
const ZA_GAME_ID = 'za'

// Ball name mappings (Showdown → ALM-accepted names)
const BALL_NAME_MAP: Record<string, string> = {
  'poke ball':     'Poké Ball',
  'pokeball':      'Poké Ball',
  'poke':          'Poké Ball',
  'great ball':    'Great Ball',
  'ultra ball':    'Ultra Ball',
  'master ball':   'Master Ball',
  'safari ball':   'Safari Ball',
  'net ball':      'Net Ball',
  'dive ball':     'Dive Ball',
  'nest ball':     'Nest Ball',
  'repeat ball':   'Repeat Ball',
  'timer ball':    'Timer Ball',
  'luxury ball':   'Luxury Ball',
  'premier ball':  'Premier Ball',
  'dusk ball':     'Dusk Ball',
  'heal ball':     'Heal Ball',
  'quick ball':    'Quick Ball',
  'cherish ball':  'Cherish Ball',
  'fast ball':     'Fast Ball',
  'level ball':    'Level Ball',
  'lure ball':     'Lure Ball',
  'heavy ball':    'Heavy Ball',
  'love ball':     'Love Ball',
  'friend ball':   'Friend Ball',
  'moon ball':     'Moon Ball',
  'sport ball':    'Sport Ball',
  'park ball':     'Park Ball',
  'dream ball':    'Dream Ball',
  'beast ball':    'Beast Ball',
}

function normalizeBallName(ball: string): string {
  const lower = ball.toLowerCase().trim()
  return BALL_NAME_MAP[lower] ?? capitalize(ball)
}

export function buildShowdownText(pokemon: PokemonBuildPayload, gameVersion?: string): string {
  const lines: string[] = []
  const isLegendsZA = gameVersion === LEGENDS_ZA_GAME || gameVersion === ZA_GAME_ID

  // ── Header: Species @ HeldItem ───────────────────────────────────────
  const hasHeldItem = pokemon.heldItem &&
    pokemon.heldItem.trim() !== '' &&
    pokemon.heldItem.toLowerCase() !== 'none'
  const speciesLine = hasHeldItem
    ? `${formatSpeciesName(pokemon.species)} @ ${capitalize(pokemon.heldItem!)}`
    : formatSpeciesName(pokemon.species)
  lines.push(speciesLine)

  // ── Ability ──────────────────────────────────────────────────────────
  if (pokemon.ability) {
    lines.push(`Ability: ${capitalize(pokemon.ability)}`)
  }

  // ── Level ────────────────────────────────────────────────────────────
  lines.push(`Level: ${pokemon.level}`)

  // ── Shiny ────────────────────────────────────────────────────────────
  if (pokemon.shiny) {
    lines.push('Shiny: Yes')
  }

  // ── Alpha (Legends ZA only) ───────────────────────────────────────────
  if (pokemon.alpha && isLegendsZA) {
    lines.push('Alpha: Yes')
  }

  // ── Gender ───────────────────────────────────────────────────────────
  if (pokemon.gender === 'M' || pokemon.gender === 'Male') lines.push('Gender: Male')
  else if (pokemon.gender === 'F' || pokemon.gender === 'Female') lines.push('Gender: Female')

  // ── Language ─────────────────────────────────────────────────────────
  // Event Pokémon (Genesect, Groudon HOME, etc.) carry their own language from
  // the event data payload. For regular Pokémon we default to Spanish.
  const eventLanguage = (pokemon as any).eventLanguage
  const language = eventLanguage ?? ((pokemon as any).language ?? 'Spanish')
  const strictEventSpecies = [
    'genesect', 'hoopa', 'volcanion', 'diancie', 'zarude', 'zeraora',
    'marshadow', 'meloetta', 'victini', 'groudon', 'kyogre', 'rayquaza',
  ]
  const isStrictEvent = strictEventSpecies.includes(String(pokemon.species).toLowerCase())
  if (!isStrictEvent || eventLanguage) {
    lines.push(`Language: ${language}`)
  }

  // ── Event OT / TID (for Cherish Ball event Pokémon) ──────────────────
  const eventOT  = (pokemon as any).eventOT
  const eventTID = (pokemon as any).eventTID
  if (eventOT)  lines.push(`OT: ${eventOT}`)
  if (eventTID) lines.push(`TID: ${eventTID}`)

  // ── Tera Type (not applicable for Legends ZA) ────────────────────────
  if (pokemon.teraType && !isLegendsZA) {
    lines.push(`Tera Type: ${capitalize(pokemon.teraType)}`)
  }

  // ── Ball ─────────────────────────────────────────────────────────────
  if (!isLegendsZA && pokemon.pokeball) {
    lines.push(`Ball: ${normalizeBallName(pokemon.pokeball)}`)
  }

  // ── EVs ───────────────────────────────────────────────────────────────────
  if (!isLegendsZA && pokemon.evs) {
    const evParts = buildStatLine(pokemon.evs)
    if (evParts) lines.push(`EVs: ${evParts}`)
  }

  // ── Nature ───────────────────────────────────────────────────────────
  if (pokemon.nature) {
    lines.push(`${capitalize(pokemon.nature)} Nature`)
  }

  // ── IVs (only show non-31 values) ──────────────────────────────────
  if (pokemon.ivs) {
    const ivParts = buildStatLine(pokemon.ivs, 31)
    if (ivParts) lines.push(`IVs: ${ivParts}`)
  }

  // ── Moves ────────────────────────────────────────────────────────────
  if (!isLegendsZA && Array.isArray(pokemon.moves)) {
    const validMoves = pokemon.moves.filter(Boolean)
    for (const move of validMoves) {
      lines.push(`- ${capitalize(move)}`)
    }
  }

  return lines.join('\n')
}

export function teamToShowdownText(team: PokemonBuildPayload[], gameVersion?: string): string {
  return team.map((p) => buildShowdownText(p, gameVersion)).join('\n\n')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function capitalize(str: string): string {
  if (!str) return str
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

const REGIONAL_SUFFIXES = ['-galar', '-alola', '-hisui', '-paldea']

const SPECIES_NAME_OVERRIDES: Record<string, string> = {
  'mr-mime':         'Mr. Mime',
  'mr-mime-galar':   'Mr. Mime-Galar',
  'mr-rime':         'Mr. Rime',
  'mime-jr':         'Mime Jr.',
  'farfetchd':       "Farfetch'd",
  'farfetchd-galar': "Farfetch'd-Galar",
  'sirfetchd':       "Sirfetch'd",
  'nidoran-f':       'Nidoran-F',
  'nidoran-m':       'Nidoran-M',
  'ho-oh':           'Ho-Oh',
  'porygon-z':       'Porygon-Z',
  'jangmo-o':        'Jangmo-o',
  'hakamo-o':        'Hakamo-o',
  'kommo-o':         'Kommo-o',
  'type-null':       'Type: Null',
  'flabebe':         'Flabébé',
  'zygarde-10':      'Zygarde-10%',
  'zygarde-10%':     'Zygarde-10%',
  'zygarde-10%-c':   'Zygarde-10%',
  'zygarde-50':      'Zygarde',
  'zygarde-50-c':    'Zygarde',
  'zygarde-50%':     'Zygarde',
  'zygarde-complete':'Zygarde-Complete',
}

function formatSpeciesName(slug: string): string {
  if (!slug) return slug
  const lower = slug.toLowerCase().replace('’', "'")

  if (SPECIES_NAME_OVERRIDES[lower]) {
    return SPECIES_NAME_OVERRIDES[lower]
  }

  if (lower === 'zygarde-10%-c' || lower === 'zygarde-10-c') return 'Zygarde-10%'
  if (lower === 'zygarde-50%-c' || lower === 'zygarde-50-c' || lower === 'zygarde-50') return 'Zygarde'

  for (const suffix of REGIONAL_SUFFIXES) {
    if (lower.endsWith(suffix)) {
      const basePart = slug.slice(0, slug.length - suffix.length)
      const formattedBase = basePart
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')
      const formattedSuffix = suffix.charAt(1).toUpperCase() + suffix.slice(2)
      return `${formattedBase}-${formattedSuffix}`
    }
  }

  return capitalize(slug)
}

interface Stats {
  hp: number
  attack: number
  defense: number
  spAttack: number
  spDefense: number
  speed: number
}

function buildStatLine(stats: Stats, exclude?: number): string {
  const mapping: [string, number][] = [
    ['HP', stats.hp],
    ['Atk', stats.attack],
    ['Def', stats.defense],
    ['SpA', stats.spAttack],
    ['SpD', stats.spDefense],
    ['Spe', stats.speed],
  ]

  const parts = mapping
    .filter(([, val]) => {
      if (exclude !== undefined) return val !== exclude
      return val > 0
    })
    .map(([label, val]) => `${val} ${label}`)

  return parts.join(' / ')
}
