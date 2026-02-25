'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRightLeft, Sparkles, Filter, Info, Server,
  ChevronRight, Search, Loader2, Plus, Trash2, X
} from 'lucide-react'
import GameSelector from '@/components/teambuilder/GameSelector'
import { PokemonGrid } from '@/components/teambuilder/PokemonGrid'
import { PokemonEditorModal } from '@/components/teambuilder/PokemonEditorModal'
import { TradeCodeModal } from '@/components/teambuilder/TradeCodeModal'
import { usePokemonSearch } from '@/hooks/usePokemonSearch'
import type { GameVersion, PokemonSearchResult, Pokemon, PokemonBuild } from '@/lib/pokemon/types'
import { pokeAPI } from '@/lib/pokemon/pokeapi'
import { preloadGamePokedex } from '@/lib/pokemon/gameAvailability'

const PENDING_BUILD_KEY = 'pkdex_pending_build'
const MAX_TEAM_SIZE = 6

interface HomeTeambuilderProps {
  user: any // Supabase user
}

// ─── Team Slot Card ──────────────────────────────────────────────────────────

interface TeamSlotCardProps {
  slot: number
  build: PokemonBuild | null
  isActive: boolean
  onClick: () => void
  onRemove: () => void
}

function TeamSlotCard({ slot, build, isActive, onClick, onRemove }: TeamSlotCardProps) {
  const spriteUrl = build
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${build.pokemon.id}.png`
    : null

  return (
    <div
      onClick={onClick}
      className={`
        relative group aspect-square rounded-2xl border-2 cursor-pointer
        transition-all duration-200 flex flex-col items-center justify-center gap-2
        ${build
          ? isActive
            ? 'border-green-400 bg-white/15 shadow-lg shadow-green-500/20'
            : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/15'
          : 'border-dashed border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
        }
      `}
    >
      {build ? (
        <>
          {/* Remove button */}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                       w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center
                       text-white z-10"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Sprite */}
          {spriteUrl && (
            <img src={spriteUrl} alt={build.pokemon.name} className="w-16 h-16 object-contain drop-shadow-lg" />
          )}

          {/* Name */}
          <span className="text-white font-bold text-sm capitalize text-center leading-tight px-2 truncate w-full text-center">
            {build.pokemon.name}
          </span>
          <span className="text-white/50 text-xs">Slot {slot}</span>
        </>
      ) : (
        <>
          <span className="text-white/30 text-5xl font-thin">?</span>
          <span className="text-white/30 text-xs font-medium">Slot {slot}</span>
        </>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HomeTeambuilder({ user }: HomeTeambuilderProps) {
  const router = useRouter()
  const [selectedGame, setSelectedGame] = useState<GameVersion>('legends-za')

  // Preload the Pokédex for the selected game so availability checks are instant
  const handleGameSelect = (game: GameVersion) => {
    setSelectedGame(game)
    preloadGamePokedex(game).catch(console.error)
  }

  // Preload on mount for the default game
  useEffect(() => {
    preloadGamePokedex(selectedGame).catch(console.error)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

  // Up to 6 builds — null means empty slot
  const [team, setTeam] = useState<(PokemonBuild | null)[]>(Array(MAX_TEAM_SIZE).fill(null))

  // Which slot is currently being edited (for replacing)
  const [editingSlot, setEditingSlot] = useState<number | null>(null)

  const { query, setQuery, results, loading } = usePokemonSearch()

  // Restore pending build saved before login redirect
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PENDING_BUILD_KEY)
      if (saved) {
        const pending: { pokemon: Pokemon; build: PokemonBuild } = JSON.parse(saved)
        localStorage.removeItem(PENDING_BUILD_KEY)
        setSelectedPokemon(pending.pokemon)
        setIsModalOpen(true)
      }
    } catch {
      localStorage.removeItem(PENDING_BUILD_KEY)
    }
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────

  const filledSlots = team.filter(Boolean)
  const hasTeam = filledSlots.length > 0

  const getNextEmptySlot = (): number | null => {
    const idx = team.findIndex((b) => b === null)
    return idx === -1 ? null : idx
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handlePokemonSelect = async (result: PokemonSearchResult | null) => {
    if (!result) { setSelectedPokemon(null); return }
    try {
      const pokemon = await pokeAPI.getPokemon(result.id)
      setSelectedPokemon(pokemon)
      // Default: target the first empty slot
      setEditingSlot(getNextEmptySlot())
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading pokemon:', error)
    }
  }

  const handleSlotClick = async (slotIndex: number) => {
    const existing = team[slotIndex]
    if (existing) {
      // Edit existing Pokémon
      setSelectedPokemon(existing.pokemon)
      setEditingSlot(slotIndex)
      setIsModalOpen(true)
    } else {
      // Open the search for empty slot
      setEditingSlot(slotIndex)
      // Scroll to search
      document.getElementById('editor-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleRemoveSlot = (slotIndex: number) => {
    setTeam((prev) => {
      const next = [...prev]
      next[slotIndex] = null
      return next
    })
  }

  const handleAddToTeam = (build: PokemonBuild) => {
    if (!user) {
      // Save pending build and redirect to login
      if (selectedPokemon) {
        try {
          localStorage.setItem(PENDING_BUILD_KEY, JSON.stringify({ pokemon: selectedPokemon, build }))
        } catch { /* storage full */ }
      }
      const currentPath = window.location.pathname === '/' ? '/teambuilder' : window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    // Place build into the target slot (or next empty slot)
    const targetSlot = editingSlot !== null ? editingSlot : getNextEmptySlot()
    if (targetSlot === null) {
      // Team is full, replace slot 0 (fallback)
      setTeam((prev) => { const next = [...prev]; next[0] = build; return next })
    } else {
      setTeam((prev) => { const next = [...prev]; next[targetSlot] = build; return next })
    }

    setIsModalOpen(false)
    setSelectedPokemon(null)
    setEditingSlot(null)
  }

  const handleSolicitarIntercambio = () => {
    if (!hasTeam) return
    setIsTradeModalOpen(true)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">

      {/* ── CONTROL BLOCK ── */}
      <div className="py-12 px-6 bg-white w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
              Crea tu Pokémon <span className="text-pokemon-blue">Ideal</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Selecciona tu juego, busca el Pokémon que deseas y configúralo con estadísticas competitivas en segundos.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-6 bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            {/* Game Selector */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <label className="flex items-center gap-2 text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                <span className="bg-pokemon-blue w-6 h-6 flex items-center justify-center rounded-full text-white">1</span>
                Versión del Juego
              </label>
              <GameSelector selected={selectedGame} onSelect={handleGameSelect} />
            </div>

            <div className="hidden md:flex col-span-1 justify-center items-center">
              <ChevronRight className="w-8 h-8 text-gray-300" />
            </div>

            {/* Search Bar */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <label className="flex items-center gap-2 text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                <span className="bg-pokemon-blue w-6 h-6 flex items-center justify-center rounded-full text-white">2</span>
                Buscar Pokémon
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ejemplo: Charizard, Arceus..."
                  className="w-full bg-white border-2 border-gray-300 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all font-medium"
                />
                {loading && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pokemon-blue animate-spin" />
                )}
              </div>
              <div className="flex gap-2 mt-4 items-center">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Filtros Rápidos:</span>
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-600 hover:border-pokemon-blue cursor-pointer transition-colors">🔥 Fuego</span>
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-600 hover:border-pokemon-blue cursor-pointer transition-colors">✨ Legendarios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH RESULTS ── */}
      <div id="editor-section" className="py-12 px-6 bg-gray-100 border-t border-gray-200 min-h-[400px] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-pokemon-blue w-8 h-8 flex items-center justify-center rounded-full text-white font-black">3</span>
            <h3 className="text-2xl font-black text-gray-900 uppercase">Selecciona para Editar</h3>
          </div>
          <PokemonGrid results={results} loading={loading} onSelect={handlePokemonSelect} />
        </div>
      </div>

      {/* ── TEAM SLOTS ── */}
      <div
        className="py-12 px-6 border-t border-white/10 w-full relative"
        style={{
          backgroundImage: "url('/FONDOLOGIN.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/80" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="bg-pokemon-yellow w-8 h-8 flex items-center justify-center rounded-full text-gray-900 font-black">4</span>
            <div>
              <h3 className="text-2xl font-black text-white uppercase">Tu Equipo</h3>
              <p className="text-white/50 text-sm">
                {filledSlots.length} / {MAX_TEAM_SIZE} Pokémon — Añade al menos 1 para solicitar intercambio
              </p>
            </div>
          </div>

          {/* 6 Slots Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {team.map((build, index) => (
              <TeamSlotCard
                key={index}
                slot={index + 1}
                build={build}
                isActive={editingSlot === index}
                onClick={() => handleSlotClick(index)}
                onRemove={() => handleRemoveSlot(index)}
              />
            ))}
          </div>

          {/* Solicitar Intercambio Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSolicitarIntercambio}
              disabled={!hasTeam}
              className={`
                flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-widest
                transition-all duration-200
                ${hasTeam
                  ? 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/30 hover:scale-105 hover:shadow-green-500/50'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
                }
              `}
            >
              <ArrowRightLeft className="w-6 h-6" />
              Solicitar Intercambio
            </button>
          </div>

          {!user && hasTeam && (
            <p className="text-center text-white/40 text-sm mt-4">
              Inicia sesión para solicitar el intercambio
            </p>
          )}
        </div>
      </div>

      {/* ── TRUST SECTION ── */}
      <div className="py-16 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="flex items-center gap-4 bg-green-50 border border-green-200 px-6 py-4 rounded-2xl">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </div>
              <div>
                <h4 className="font-black text-green-900 uppercase tracking-tight">Sistemas Operativos</h4>
                <p className="text-green-700 text-sm">Bots en línea 24/7 para intercambios inmediatos.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center text-sm font-bold text-gray-600">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><Server className="w-5 h-5" /></div>
                <span>Intercambios Seguros</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><ArrowRightLeft className="w-5 h-5" /></div>
                <span>Entrega en Segundos</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                <span>100% Legales</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-pokemon-blue" />
                Preguntas Frecuentes
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">¿Cómo funciona el intercambio?</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Configura tu equipo de hasta 6 Pokémon, haz clic en &quot;Solicitar Intercambio&quot; y recibirás un Código de 8 dígitos. Introdúcelo en el &quot;Poképortal&quot; de tu juego para conectarte con nuestro bot automático.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">¿Los Pokémon son legales para jugar online?</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Sí. Todos los Pokémon son generados siguiendo el mismo estándar de validación que <strong>Pokémon Showdown</strong>, garantizando movimientos, estadísticas y habilidades 100% legales.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-black text-white uppercase mb-4">¿Listo para empezar?</h3>
              <p className="text-gray-400 mb-8">Únete a cientos de jugadores que ya están optimizando su tiempo competitivo.</p>
              {!user && (
                <button onClick={() => router.push('/login')} className="w-full bg-linear-to-r from-pokemon-blue to-blue-500 py-4 rounded-xl font-black tracking-widest uppercase hover:scale-105 transition-transform">
                  Crear Cuenta Gratis
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <PokemonEditorModal
        pokemon={selectedPokemon}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSlot(null) }}
        onAddToTeam={handleAddToTeam}
        gameVersion={selectedGame}
      />

      <TradeCodeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        team={filledSlots as PokemonBuild[]}
        gameVersion={selectedGame}
        pokemonName={
          filledSlots.length === 1
            ? filledSlots[0]?.pokemon.name
            : `${filledSlots.length} Pokémon`
        }
      />
    </div>
  )
}
