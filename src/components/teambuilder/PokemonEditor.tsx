'use client'

import React, { useState, useMemo } from 'react'
import { Pokemon, PokemonBuild, PokemonStats, Nature, Move } from '@/lib/pokemon/types'
import { NATURES } from '@/lib/pokemon/constants'
import { StatsEditor } from './StatsEditor'
import { NatureSelector } from './NatureSelector'
import { TeraTypeSelector } from './TeraTypeSelector'
import { AbilitySelector } from './AbilitySelector'
import { MoveSlot } from './MoveSlot'
import { MoveSelector } from './MoveSelector'
import { PokeBallSelector } from './PokeBallSelector'
import { HeldItemSelector } from './HeldItemSelector'
import { OriginSelector } from './OriginSelector'
import { TYPE_COLORS } from '@/lib/pokemon/constants'
import Image from 'next/image'
import { useLegality } from '@/hooks/useLegality'
import { LegalityPanel } from './LegalityPanel'

interface PokemonEditorProps {
  pokemon: Pokemon | null
  onAddToTeam: (build: PokemonBuild) => void
}

export function PokemonEditor({ pokemon, onAddToTeam }: PokemonEditorProps) {
  const [stats, setStats] = useState<PokemonStats>({
    hp: { iv: 31, ev: 0 },
    attack: { iv: 31, ev: 0 },
    defense: { iv: 31, ev: 0 },
    spAttack: { iv: 31, ev: 0 },
    spDefense: { iv: 31, ev: 0 },
    speed: { iv: 31, ev: 0 }
  })

  const [nature, setNature] = useState<Nature>(NATURES[0]) // Hardy by default
  const [teraType, setTeraType] = useState<string>('normal')
  const [ability, setAbility] = useState<string>('')
  const [moves, setMoves] = useState<(Move | null)[]>([null, null, null, null])
  const [level, setLevel] = useState<number>(100)
  const [shiny, setShiny] = useState<boolean>(false)
  const [gender, setGender] = useState<'male' | 'female' | 'genderless'>('genderless')
  const [pokeball, setPokeball] = useState<string>('Poké Ball')
  const [heldItem, setHeldItem] = useState<string>('None')
  const [origin, setOrigin] = useState<string>('Wild Encounter')
  
  const [showMoveSelector, setShowMoveSelector] = useState(false)
  const [activeMoveSlot, setActiveMoveSlot] = useState<number>(0)

  // ─── Real-time legality validation ───────────────────────
  const currentBuild: PokemonBuild | null = useMemo(() => {
    if (!pokemon) return null
    return { pokemon, stats, nature, teraType, ability, moves, shiny, gender, level, pokeball, heldItem, origin }
  }, [pokemon, stats, nature, teraType, ability, moves, shiny, gender, level, pokeball, heldItem, origin])

  const { results, errors, warnings, isLegal, errorCount, warningCount } = useLegality(currentBuild)

  // Set initial ability when pokemon changes
  React.useEffect(() => {
    if (pokemon && pokemon.abilities.length > 0) {
      setAbility(pokemon.abilities[0].ability.name)
      if (pokemon.types.length > 0) {
        setTeraType(pokemon.types[0].type.name)
      }
    }
  }, [pokemon])

  if (!pokemon) {
    return (
      <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-500 font-bold">
          Selecciona un Pokémon para comenzar a personalizar
        </p>
      </div>
    )
  }

  const handleMoveSelect = (move: Move) => {
    const newMoves = [...moves]
    newMoves[activeMoveSlot] = move
    setMoves(newMoves)
  }

  const handleMoveRemove = (index: number) => {
    const newMoves = [...moves]
    newMoves[index] = null
    setMoves(newMoves)
  }

  const handleAddToTeam = () => {
    const build: PokemonBuild = {
      pokemon,
      stats,
      nature,
      teraType,
      ability,
      moves,
      shiny,
      gender,
      level,
      pokeball,
      heldItem,
      origin
    }
    onAddToTeam(build)
  }

  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Pokemon Preview */}
      <div className="lg:col-span-1">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 sticky top-6">
          {/* Pokemon Image */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 flex items-center justify-center">
            {sprite && (
              <Image
                src={sprite}
                alt={pokemon.name}
                width={200}
                height={200}
                className="w-full h-auto"
              />
            )}
          </div>

          {/* Pokemon Info */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-black text-gray-900 uppercase">
              {formatPokemonName(pokemon.name)}
            </h3>
            <p className="text-gray-500 font-bold">
              #{String(pokemon.id).padStart(4, '0')}
            </p>
          </div>

          {/* Types */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`${TYPE_COLORS[type.type.name] || 'bg-gray-400'} text-white font-bold px-4 py-2 rounded uppercase text-sm`}
              >
                {type.type.name}
              </span>
            ))}
          </div>

          {/* Level, Shiny, Gender */}
          <div className="space-y-3 border-t-2 border-gray-200 pt-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nivel
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-psychic text-gray-900 font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shiny"
                checked={shiny}
                onChange={(e) => setShiny(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="shiny" className="text-sm font-bold text-gray-700">
                ✨ Shiny
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Género
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'genderless')}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-psychic text-gray-900 font-bold bg-white"
              >
                <option value="male">♂️ Macho</option>
                <option value="female">♀️ Hembra</option>
                <option value="genderless">⚪ Sin género</option>
              </select>
            </div>
          </div>

          {/* Legality + Add to Team — always visible in sticky panel */}
          <div className="mt-4 space-y-3">
            <LegalityPanel
              results={results}
              isLegal={isLegal}
              errorCount={errorCount}
              warningCount={warningCount}
            />
            <button
              onClick={handleAddToTeam}
              disabled={!isLegal}
              title={!isLegal ? `Corrige ${errorCount} error${errorCount > 1 ? 'es' : ''} para continuar` : ''}
              className={`w-full font-black text-lg py-4 rounded-lg transition-all shadow-lg uppercase ${
                isLegal
                  ? 'bg-linear-to-r from-psychic to-electric text-white hover:scale-105 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
              }`}
            >
              {isLegal ? 'Agregar al Equipo →' : `⛔ ${errorCount} Error${errorCount > 1 ? 'es' : ''} — Corrige para continuar`}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Editor */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stats Editor */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <StatsEditor stats={stats} onStatsChange={setStats} />
        </div>

        {/* Nature */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <NatureSelector selectedNature={nature} onNatureChange={setNature} />
        </div>

        {/* Teratipo */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <TeraTypeSelector selectedType={teraType} onTypeChange={setTeraType} />
        </div>

        {/* Ability */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <AbilitySelector
            pokemon={pokemon}
            selectedAbility={ability}
            onAbilityChange={setAbility}
          />
        </div>

        {/* Poké Ball */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <PokeBallSelector
            selectedBall={pokeball}
            onBallChange={setPokeball}
          />
        </div>

        {/* Held Item */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <HeldItemSelector
            selectedItem={heldItem}
            onItemChange={setHeldItem}
          />
        </div>

        {/* Origin */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <OriginSelector
            selectedOrigin={origin}
            onOriginChange={setOrigin}
          />
        </div>

        {/* Moves */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-black text-gray-900 uppercase mb-4">
            Movimientos
          </h3>
          <div className="space-y-3">
            {moves.map((move, index) => (
              <MoveSlot
                key={index}
                moveIndex={index}
                move={move}
                onSelect={() => {
                  setActiveMoveSlot(index)
                  setShowMoveSelector(true)
                }}
                onRemove={() => handleMoveRemove(index)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Move Selector Modal */}
      {showMoveSelector && (
        <MoveSelector
          pokemon={pokemon}
          onMoveSelect={handleMoveSelect}
          onClose={() => setShowMoveSelector(false)}
        />
      )}
    </div>
  )
}
