/**
 * gameAvailability.ts
 *
 * Checks whether a Pokémon species is available in a given game version.
 *
 * For Legends Z-A: uses a hardcoded whitelist scraped from pokemondb.net/pokedex/game/legends-z-a
 * For Scarlet/Violet: queries PokeAPI regional pokedexes (paldea, kitakami, blueberry).
 */

import { GameVersion } from './types'
import { GAME_LEGALITY_RULES } from './legalityData'

// ─── PokeAPI Pokédex IDs per game ────────────────────────────────────────────
//
// Scarlet / Violet share the same three regional dexes via PokeAPI.
// Legends: Z-A uses a manual whitelist (see below) — no PokeAPI entry yet.
//
const GAME_POKEDEX_IDS: Partial<Record<GameVersion, number[]>> = {
  scarlet: [31, 32, 33], // paldea (31), kitakami (32), blueberry (33)
  violet:  [31, 32, 33],
  // legends-za → handled via LEGENDS_ZA_WHITELIST below
}

// ─── Legends: Z-A Pokédex Whitelist ──────────────────────────────────────────
//
// Source: https://pokemondb.net/pokedex/game/legends-z-a  (scraped 2025-03-25)
// The DLC "Mega Dimension" has its own separate Pokédex and is NOT included here.
// All names are lowercase-hyphenated to match PokeAPI conventions.
//
const LEGENDS_ZA_WHITELIST = new Set([
  // ── Starters (from other regions) ────────────────────────────────────────
  'chikorita', 'bayleef', 'meganium',
  'tepig', 'pignite', 'emboar',
  'totodile', 'croconaw', 'feraligatr',

  // ── Kalos-native + extras ─────────────────────────────────────────────────
  'fletchling', 'fletchinder', 'talonflame',
  'bunnelby', 'diggersby',
  'scatterbug', 'spewpa', 'vivillon',
  'weedle', 'kakuna', 'beedrill',
  'pidgey', 'pidgeotto', 'pidgeot',
  'mareep', 'flaaffy', 'ampharos',
  'patrat', 'watchog',
  'budew', 'roselia', 'roserade',
  'magikarp', 'gyarados',
  'binacle', 'barbaracle',
  'staryu', 'starmie',
  'flabebe', 'floette', 'florges',
  'skiddo', 'gogoat',
  'espurr', 'meowstic',
  'litleo', 'pyroar',
  'pancham', 'pangoro',
  'trubbish', 'garbodor',
  'dedenne',
  'pichu', 'pikachu', 'raichu',
  'cleffa', 'clefairy', 'clefable',
  'spinarak', 'ariados',
  'ekans', 'arbok',
  'abra', 'kadabra', 'alakazam',
  'gastly', 'haunter', 'gengar',
  'venipede', 'whirlipede', 'scolipede',
  'honedge', 'doublade', 'aegislash',
  'bellsprout', 'weepinbell', 'victreebel',
  'pansage', 'simisage',
  'pansear', 'simisear',
  'panpour', 'simipour',
  'meditite', 'medicham',
  'electrike', 'manectric',
  'ralts', 'kirlia', 'gardevoir', 'gallade',
  'houndour', 'houndoom',
  'swablu', 'altaria',
  'audino',
  'spritzee', 'aromatisse',
  'swirlix', 'slurpuff',
  'eevee', 'vaporeon', 'jolteon', 'flareon', 'espeon', 'umbreon', 'leafeon', 'glaceon', 'sylveon',
  'buneary', 'lopunny',
  'shuppet', 'banette',
  'vanillite', 'vanillish', 'vanilluxe',
  'numel', 'camerupt',
  'hippopotas', 'hippowdon',
  'drilbur', 'excadrill',
  'sandile', 'krokorok', 'krookodile',
  'machop', 'machoke', 'machamp',
  'gible', 'gabite', 'garchomp',
  'carbink',
  'sableye',
  'mawile',
  'absol',
  'riolu', 'lucario',
  'slowpoke', 'slowbro', 'slowking',
  'carvanha', 'sharpedo',
  'tynamo', 'eelektrik', 'eelektross',
  'dratini', 'dragonair', 'dragonite',
  'bulbasaur', 'ivysaur', 'venusaur',
  'charmander', 'charmeleon', 'charizard',
  'squirtle', 'wartortle', 'blastoise',
  'stunfisk',
  'furfrou',
  'inkay', 'malamar',
  'skrelp', 'dragalge',
  'clauncher', 'clawitzer',
  'goomy', 'sliggoo', 'goodra',
  'delibird',
  'snorunt', 'glalie', 'froslass',
  'snover', 'abomasnow',
  'bergmite', 'avalugg',
  'scyther', 'scizor',
  'pinsir',
  'heracross',
  'emolga',
  'hawlucha',
  'phantump', 'trevenant',
  'scraggy', 'scrafty',
  'noibat', 'noivern',
  'klefki',
  'litwick', 'lampent', 'chandelure',
  'aerodactyl',
  'tyrunt', 'tyrantrum',
  'amaura', 'aurorus',
  'onix', 'steelix',
  'aron', 'lairon', 'aggron',
  'helioptile', 'heliolisk',
  'pumpkaboo', 'gourgeist',
  'larvitar', 'pupitar', 'tyranitar',
  'froakie', 'frogadier', 'greninja',
  'falinks',
  'chespin', 'quilladin', 'chesnaught',
  'skarmory',
  'fennekin', 'braixen', 'delphox',
  'bagon', 'shelgon', 'salamence',
  'kangaskhan',
  'drampa',
  'beldum', 'metang', 'metagross',

  // ── Legendaries / Mythicals (base game) ─────────────────────────────────
  'xerneas', 'yveltal', 'zygarde', 'zygarde-10', 'zygarde-10%', 'zygarde-50', 'zygarde-50%', 'zygarde-complete',
  'diancie',
  'mewtwo',

  // ── DLC: Mega Dimension / Lumiose Hyperspace ─────────────────────────────
  // Source: pokeos.com/es/pokedex/dex/plza-dlc + pokemondb.net/pokedex/game/legends-z-a/mega-dimension
  // PokeAPI slugs: lowercase-hyphenated. Regional forms use suffix: -alola, -galar, -hisui

  // Gen 1 regional + extras
  'mankey', 'primeape', 'annihilape',
  'meowth',                           // Kantonian Meowth → Persian
  'meowth-alola',                     // Alolan Meowth → Persian-Alola
  'meowth-galar',                     // Galarian Meowth → Perrserker (already in whitelist)
  'persian', 'persian-alola',
  'farfetchd',                        // Kantonian Farfetch'd
  'farfetchd-galar',                  // Galarian Farfetch'd → Sirfetch'd (already in whitelist)
  'cubone',
  'marowak',                          // Kantonian Marowak
  'marowak-alola',                    // Alolan Marowak (Fire/Ghost type)
  'porygon', 'porygon2', 'porygon-z',
  'perrserker',                       // Galarian Meowth evolution
  'kecleon',
  'mime-jr', 'mr-mime', 'mr-rime',
  'igglybuff', 'jigglypuff', 'wigglytuff',
  'zangoose', 'seviper',
  'cryogonal',
  'zubat', 'golbat', 'crobat',
  'gulpin', 'swalot',
  'spoink', 'grumpig',
  'qwilfish',                          // Kantonian Qwilfish
  'qwilfish-hisui',                    // Hisuian Qwilfish → Overqwil
  'overqwil',                          // Hisuian evolution
  'sirfetchd',                         // Galarian Farfetch'd evolution

  // Gen 2 regional
  'slowpoke-galar',                   // Galarian Slowpoke (already have slowpoke/slowbro/slowking via base game)
  'qwilfish-hisui',                   // Hisuian Qwilfish → Overqwil (already in whitelist)

  // Gen 4 regional
  'growlithe-hisui',                  // Hisuian Growlithe → Hisuian Arcanine
  'arcanine-hisui',

  // Gen 3 starters + extras
  'treecko', 'grovyle', 'sceptile',
  'torchic', 'combusken', 'blaziken',
  'mudkip', 'marshtomp', 'swampert',
  'feebas', 'milotic',
  'latias', 'latios',
  'kyogre', 'groudon', 'rayquaza',

  // Gen 4 extras
  'starly', 'staravia', 'staraptor',
  'chingling', 'chimecho',
  'golett', 'golurk',

  // Gen 5 extras
  'throh', 'sawk',
  'munna', 'musharna',
  'yamask', 'cofagrigus', 'runerigus',
  'purrloin', 'liepard',
  'foongus', 'amoonguss',
  'kleavor',
  // Swords of Justice + Mythicals
  'cobalion', 'terrakion', 'virizion', 'keldeo',
  'meloetta', 'meloetta-aria', 'meloetta-pirouette', 'genesect',
  'heatran', 'volcanion',

  // Gen 6 extras (DLC side)
  'hoopa', 'hoopa-confined', 'hoopa-unbound',

  // Gen 7 extras + regional forms
  'mimikyu',
  'wimpod', 'golisopod',
  'sandygast', 'palossand',
  'marshadow',
  'magearna', 'magearna-original', 'zeraora',
  'meltan', 'melmetal',
  'rotom',
  'morpeko',
  // Gen 7 regional forms available in ZA DLC
  'vulpix-alola',                      // Alolan Vulpix → Ninetales-Alola
  'ninetales-alola',
  'sandshrew-alola',                   // Alolan Sandshrew → Sandslash-Alola
  'sandslash-alola',
  'diglett-alola',                     // Alolan Diglett → Dugtrio-Alola
  'dugtrio-alola',
  'geodude-alola',                     // Alolan Geodude → Graveler-Alola → Golem-Alola
  'graveler-alola', 'golem-alola',
  'grimer-alola',                      // Alolan Grimer → Muk-Alola
  'muk-alola',
  'exeggutor-alola',                   // Alolan Exeggutor
  'raichu-alola',                      // Alolan Raichu

  // Gen 8 extras + regional forms
  'rookidee', 'corvisquire', 'corviknight',
  'nickit', 'thievul',
  'clobbopus', 'grapploct',
  'indeedee',
  // Gen 8 Galarian forms (base forms that were missing, evos already listed)
  // Note: perrserker comes from meowth-galar already listed above
  // mr-rime comes from mr-mime-galar
  'mr-mime-galar',                     // Galarian Mr. Mime → Mr. Rime (already in whitelist)

  // Gen 9 extras (Paldea Pokémon)
  'capsakid', 'scovillain',
  'tinkatink', 'tinkatuff', 'tinkaton',
  'cyclizar',
  'glimmet', 'glimmora',
  'greavard', 'houndstone',
  'dondozo', 'tatsugiri',
  'frigibax', 'arctibax', 'baxcalibur',
  'gimmighoul', 'gholdengo',
  'charcadet', 'armarouge', 'ceruledge',
  'maschiff', 'mabosstiff',
  'toxel', 'toxtricity',
  'shroodle', 'grafaiai',
  'flamigo',
  'crabrawler', 'crabominable',
  'squawkabilly',
  'nacli', 'naclstack', 'garganacl',
  'fidough', 'dachsbun',
  'darkrai',

  // Gen 9 (Paldea) more
  'misdreavus', 'mismagius',

  // HOME Transfer additions (Ultra Beasts & Alolan Legendaries)
  'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'nihilego',
  'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord',
  'necrozma', 'necrozma-dusk', 'necrozma-dawn', 'necrozma-ultra',
  'poipole', 'naganadel', 'stakataka', 'blacephalon',
])

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
  if (!ids || ids.length === 0) return new Set()

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
 * For Legends Z-A, the whitelist is already in memory — no fetch needed.
 */
export async function preloadGamePokedex(game: GameVersion): Promise<void> {
  if (game === 'legends-za') return // whitelist is static, no network needed
  if (cache.has(game)) return

  const ids = GAME_POKEDEX_IDS[game]
  if (!ids || ids.length === 0) return

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
  // PokeAPI uses lowercase hyphenated names: "charizard", "mr-mime", etc.
  const normalised = speciesName.toLowerCase().replace(/\s+/g, '-')

  // ── Legends Z-A: whitelist takes ABSOLUTE priority ──────────────────────
  // The whitelist (+ DLC) is the single source of truth for ZA availability.
  // notAvailable entries in legalityData may be stale — the whitelist wins.
  if (game === 'legends-za') {
    return LEGENDS_ZA_WHITELIST.has(normalised)
  }

  // For other games: Manual override from GAME_LEGALITY_RULES (explicit notAvailable entries)
  const gameRules = GAME_LEGALITY_RULES[game]
  if (gameRules?.pokemonRules) {
    const speciesRules = gameRules.pokemonRules[normalised]
    if (speciesRules?.notAvailable) return false
  }

  // ── Other games: use PokeAPI Pokédex ─────────────────────────────────────
  const ids = GAME_POKEDEX_IDS[game]
  if (!ids || ids.length === 0) return null

  await preloadGamePokedex(game)
  const set = cache.get(game)
  if (!set) return null

  // SV HOME Transfer Whitelist: These Pokémon are not in the regional dexes but are allowed via HOME
  if (game === 'scarlet' || game === 'violet') {
    const SV_HOME_TRANSFER_WHITELIST = new Set([
      'mew', 'mewtwo', 'articuno', 'zapdos', 'moltres', 'articuno-galar', 'zapdos-galar', 'moltres-galar',
      'charmander', 'charmeleon', 'charizard', 'bulbasaur', 'ivysaur', 'venusaur', 'squirtle', 'wartortle', 'blastoise',
      'chikorita', 'bayleef', 'meganium', 'cyndaquil', 'quilava', 'typhlosion', 'typhlosion-hisui', 'totodile', 'croconaw', 'feraligatr',
      'treecko', 'grovyle', 'sceptile', 'torchic', 'combusken', 'blaziken', 'mudkip', 'marshtomp', 'swampert',
      'turtwig', 'grotle', 'torterra', 'chimchar', 'monferno', 'infernape', 'piplup', 'prinplup', 'empoleon',
      'snivy', 'servine', 'serperior', 'tepig', 'pignite', 'emboar', 'oshawott', 'dewott', 'samurott', 'samurott-hisui',
      'chespin', 'quilladin', 'chesnaught', 'fennekin', 'braixen', 'delphox', 'froakie', 'frogadier', 'greninja',
      'rowlet', 'dartrix', 'decidueye', 'decidueye-hisui', 'litten', 'torracat', 'incineroar', 'popplio', 'brionne', 'primarina',
      'grookey', 'thwackey', 'rillaboom', 'scorbunny', 'raboot', 'cinderace', 'sobble', 'drizzile', 'inteleon',
      'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'kyogre', 'groudon', 'rayquaza', 'latias', 'latios',
      'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina', 'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus',
      'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem', 'keldeo', 'meloetta',
      'diancie', 'hoopa', 'volcanion', 'magearna', 'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'zarude', 'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex',
      // Hisuian forms
      'growlithe-hisui', 'arcanine-hisui', 'voltorb-hisui', 'electrode-hisui', 'qwilfish-hisui', 'sneasel-hisui', 'braviary-hisui', 'sliggoo-hisui', 'goodra-hisui', 'avalugg-hisui', 'zorua-hisui', 'zoroark-hisui',
      'wyrdeer', 'kleavor', 'ursaluna', 'basculegion', 'sneasler', 'overqwil', 'enamorus',
      // Alolan forms
      'rattata-alola', 'raticate-alola', 'raichu-alola', 'sandshrew-alola', 'sandslash-alola', 'vulpix-alola', 'ninetales-alola', 'diglett-alola', 'dugtrio-alola', 'meowth-alola', 'persian-alola', 'geodude-alola', 'graveler-alola', 'golem-alola', 'grimer-alola', 'muk-alola', 'exeggutor-alola',
      // Galarian forms
      'meowth-galar', 'ponyta-galar', 'rapidash-galar', 'slowpoke-galar', 'slowbro-galar', 'farfetchd-galar', 'weezing-galar', 'mr-mime-galar', 'corsola-galar', 'zigzagoon-galar', 'linoone-galar', 'darumaka-galar', 'darmanitan-galar', 'yamask-galar', 'stunfisk-galar', 'slowking-galar',
      // SV DLC Exclusives (Fallback for PokeAPI cache issues)
      'ogerpon', 'ogerpon-wellspring-mask', 'ogerpon-hearthflame-mask', 'ogerpon-cornerstone-mask',
      'pecharunt', 'okidogi', 'munkidori', 'fezandipiti',
      'terapagos', 'terapagos-terastal', 'terapagos-stellar',
      'gouging-fire', 'raging-bolt', 'walking-wake',
      'iron-leaves', 'iron-boulder', 'iron-crown',
      'poltchageist', 'sinistcha', 'dipplin', 'hydrapple', 'archaludon'
    ])
    if (SV_HOME_TRANSFER_WHITELIST.has(normalised)) {
      return true
    }
  }

  return set.has(normalised)
}

/**
 * Returns a human-readable name for the game version.
 */
export function getGameDisplayName(game: GameVersion): string {
  const names: Record<GameVersion, string> = {
    scarlet:      'Pokémon Escarlata',
    violet:       'Pokémon Púrpura',
    'legends-za': 'Pokémon Legends: Z-A',
  }
  return names[game] ?? game
}
