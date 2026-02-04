import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // For now using anon, ideally service_role for writes if RLS is strict

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface PokeAPIPokemon {
  id: number
  name: string
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  sprites: { front_default: string | null }
}

interface ShowdownFormatData {
  [key: string]: {
    tier?: string
    isNonstandard?: string
  }
}

async function fetchFromPokeAPI() {
  console.log('Fetching from PokeAPI (this may take a while)...')
  // Fetching a limit of 2000 to get all pokemon + forms
  const listDetails = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
  const listData = await listDetails.json()
  
  const detailedPokemon: PokeAPIPokemon[] = []
  
  // We'll fetch in batches to avoid rate limits
  const BATCH_SIZE = 50
  const results = listData.results
  
  for (let i = 0; i < results.length; i += BATCH_SIZE) {
    const batch = results.slice(i, i + BATCH_SIZE)
    console.log(`Fetching batch ${i} to ${i + BATCH_SIZE} of ${results.length}...`)
    
    const batchPromises = batch.map((item: any) => 
      fetch(item.url).then(res => res.json())
    )
    
    const batchData = await Promise.all(batchPromises)
    detailedPokemon.push(...batchData)
  }
  
  return detailedPokemon
}

async function fetchShowdownData() {
  console.log('Fetching from Pokémon Showdown GitHub (raw TS)...')
  // Fetch raw TS file
  const url = 'https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/formats-data.ts'
  const res = await fetch(url)
  const text = await res.text()
  
  // Simple regex parser to extract tiers
  // Looking for pattern: key: { ... tier: "OU" ... }
  // This is a naive parser but sufficient for this specific file structure
  const tiers: ShowdownFormatData = {}
  
  // Match each entry roughly. 
  // The file format is usually: 
  // pikachu: {
  //    tier: "PU",
  // },
  
  // We'll regex for the key and the tier property.
  // Regex explanation:
  // ([a-z0-9]+):\s*\{[^}]*tier:\s*"([^"]+)"
  const regex = /([a-z0-9]+):\s*\{[^}]*tier:\s*"([^"]+)"/g
  
  let match
  while ((match = regex.exec(text)) !== null) {
    const key = match[1]
    const tier = match[2]
    tiers[key] = { tier }
  }
  
  console.log(`Parsed ${Object.keys(tiers).length} tiers from Showdown data.`)
  return tiers
}

function normalizeName(name: string): string {
  // PokeAPI uses hyphens, Showdown keys are lowercase alphanumeric only (usually)
  // specialized cases: 
  // 'deoxys-attack' -> 'deoxysattack' in showdown? No, usually just alphanumeric.
  // Let's verify standard behavior: showdown keys are purely [a-z0-9]+
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

async function ingest() {
  try {
    const pokeApiData = await fetchFromPokeAPI()
    let showdownFormats: ShowdownFormatData = {}
    
    try {
        showdownFormats = await fetchShowdownData()
    } catch (e) {
        console.warn('Failed to fetch Showdown data, proceeding without tiers:', e)
    }
    
    const normalizedData = pokeApiData.map((p) => {
      const simpleName = normalizeName(p.name)
      const showdownInfo = showdownFormats[simpleName] || {}
      
      const stats = {
        hp: p.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
        attack: p.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
        defense: p.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
        special_attack: p.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
        special_defense: p.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
        speed: p.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
      }

      const tier = showdownInfo.tier || 'Untiered'
      
      // Fix types if it's "unknown" (sometimes happens in weird forms)
      const types = p.types.map(t => t.type.name)

      return {
        id: p.id,
        name: p.name,
        types: types,
        base_stats: stats,
        abilities: p.abilities,
        sprites: {
            front_default: p.sprites.front_default,
            showdown_anim: `https://play.pokemonshowdown.com/sprites/ani/${simpleName}.gif`, 
            showdown_static: `https://play.pokemonshowdown.com/sprites/dex/${simpleName}.png`
        },
        tier: tier,
        is_valid: true 
      }
    })

    console.log(`Prepared ${normalizedData.length} records. Uploading to Supabase...`)

    // Upsert in batches
    const UPSERT_BATCH = 100
    for (let i = 0; i < normalizedData.length; i += UPSERT_BATCH) {
        const batch = normalizedData.slice(i, i + UPSERT_BATCH)
        const { error } = await supabase.from('pokemon').upsert(batch)
        if (error) {
            console.error('Error upserting batch:', error)
        } else {
            console.log(`Upserted batch ${Math.min(i + UPSERT_BATCH, normalizedData.length)} / ${normalizedData.length}`)
        }
    }

    console.log('Ingestion complete!')

  } catch (error) {
    console.error('Ingestion failed:', error)
  }
}


ingest()
