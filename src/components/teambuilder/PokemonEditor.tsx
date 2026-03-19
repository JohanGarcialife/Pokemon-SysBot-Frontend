'use client'

import React, { useState, useMemo } from 'react'
import { Pokemon, PokemonBuild, PokemonStats, Nature, Move, GameVersion } from '@/lib/pokemon/types'
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
import { TYPE_COLORS, TYPE_TRANSLATIONS } from '@/lib/pokemon/constants'
import Image from 'next/image'
import { useLegality } from '@/hooks/useLegality'
import { useEncounterRules } from '@/hooks/useEncounterRules'
import { LegalityPanel } from './LegalityPanel'

interface PokemonEditorProps {
  pokemon: Pokemon | null
  onAddToTeam: (build: PokemonBuild) => void
  gameVersion?: GameVersion
}

export function PokemonEditor({ pokemon, onAddToTeam, gameVersion }: PokemonEditorProps) {
  const isLegendsZA = gameVersion === 'legends-za'
  // Origins that have Shiny Lock - cannot be shiny by game rules
  const GIFT_ORIGINS = ['In-Game Gift', 'Starter', 'Event']

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
  const [alpha, setAlpha] = useState<boolean>(false)
  const [gender, setGender] = useState<'male' | 'female' | 'genderless'>('genderless')
  const [pokeball, setPokeball] = useState<string>('Poké Ball')
  const [heldItem, setHeldItem] = useState<string>('None')
  const [origin, setOrigin] = useState<string>('Wild Encounter')
  
  const { isShinyDisabled, isAlphaDisabled, isPokemonNotAvailable, forcedBall, minAllowedLevel, disabledFeatures, disabledOrigins } = useEncounterRules(gameVersion, origin, pokemon?.name)

  // Opciones forzadas según reglas de origen
  React.useEffect(() => {
    if (level < minAllowedLevel) {
      setLevel(minAllowedLevel)
    }
  }, [minAllowedLevel, level])

  React.useEffect(() => {
    if (isShinyDisabled && shiny) {
      setShiny(false)
    }
  }, [isShinyDisabled, shiny])

  React.useEffect(() => {
    if (forcedBall && pokeball !== forcedBall) {
      setPokeball(forcedBall)
    }
  }, [forcedBall, pokeball])

  // Auto-reset alpha si está bloqueado
  React.useEffect(() => {
    if (isAlphaDisabled && alpha) {
      setAlpha(false)
    }
  }, [isAlphaDisabled, alpha])
  
  const [showMoveSelector, setShowMoveSelector] = useState(false)
  const [activeMoveSlot, setActiveMoveSlot] = useState<number>(0)

  // ─── Real-time legality validation ───────────────────────
  const currentBuild: PokemonBuild | null = useMemo(() => {
    if (!pokemon) return null
    return { pokemon, stats, nature, teraType, ability, moves, shiny, alpha, gender, level, pokeball, heldItem, origin }
  }, [pokemon, stats, nature, teraType, ability, moves, shiny, alpha, gender, level, pokeball, heldItem, origin])

  const { results, errors, warnings, isLegal, errorCount, warningCount } = useLegality(currentBuild, gameVersion)

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
    if (isPokemonNotAvailable) return;
    
    const build: PokemonBuild = {
      pokemon,
      stats,
      nature,
      teraType,
      ability,
      moves,
      shiny: isShinyDisabled ? false : shiny,
      alpha: isAlphaDisabled ? false : alpha,
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
                {TYPE_TRANSLATIONS[type.type.name] || type.type.name}
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
                min={minAllowedLevel}
                max={100}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-psychic text-gray-900 font-bold"
              />
              {minAllowedLevel > 1 && (
                <p className="text-xs text-orange-500 font-bold mt-1">Nivel mínimo por origen: {minAllowedLevel}</p>
              )}
            </div>

            {/* Shiny + Alpha group */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shiny"
                checked={isShinyDisabled ? false : shiny}
                disabled={isShinyDisabled}
                onChange={(e) => setShiny(e.target.checked)}
                className="w-4 h-4 disabled:opacity-40"
              />
              <label htmlFor="shiny" className={`text-sm font-bold ${isShinyDisabled ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                ✨ Shiny {isShinyDisabled ? '(bloqueado por origen)' : ''}
              </label>
            </div>

            {/* Alpha — only for Legends ZA */}
            {isLegendsZA && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="alpha"
                  checked={isAlphaDisabled ? false : alpha}
                  disabled={isAlphaDisabled}
                  onChange={(e) => setAlpha(e.target.checked)}
                  className="w-4 h-4 disabled:opacity-40"
                />
                <label htmlFor="alpha" className={`text-sm font-bold ${isAlphaDisabled ? 'text-gray-400 line-through' : 'text-red-700'}`}>
                  💢 Alpha {isAlphaDisabled ? '(bloqueado por especie/origen)' : '(Leyenda ZA)'}
                </label>
              </div>
            )}

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
              isLegal={isLegal && !isPokemonNotAvailable}
              errorCount={isPokemonNotAvailable ? errorCount + 1 : errorCount}
              warningCount={warningCount}
            />
            {isPokemonNotAvailable && (
              <div className="bg-red-100 border-l-4 border-red-600 p-4 mt-4 rounded">
                <p className="text-red-800 font-bold">
                  ⚠️ Este Pokémon no está disponible en {gameVersion === 'legends-za' ? 'Leyendas Z-A' : 'este juego'}.
                </p>
                <p className="text-sm text-red-600 mt-1">No podrás añadirlo a tu equipo.</p>
              </div>
            )}
            <button
              onClick={handleAddToTeam}
              disabled={!isLegal || isPokemonNotAvailable}
              title={(!isLegal || isPokemonNotAvailable) ? `Corrige los errores para continuar` : ''}
              className={`w-full font-black text-lg py-4 rounded-lg transition-all shadow-lg uppercase mt-4 ${
                isLegal && !isPokemonNotAvailable
                  ? 'bg-gradient-to-r from-psychic to-electric text-white hover:scale-105 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
              }`}
            >
              {isLegal && !isPokemonNotAvailable ? 'Agregar al Equipo →' : `⛔ Error — Corrige para continuar`}
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

        {/* Teratipo — Solo Scarlet/Violet, no existe en Legends ZA */}
        {!isLegendsZA && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <TeraTypeSelector selectedType={teraType} onTypeChange={setTeraType} />
          </div>
        )}

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
            disabled={!!forcedBall}
          />
        </div>

        {/* Held Item — Not supported in Legends ZA */}
        {isLegendsZA ? (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-black text-gray-900 uppercase mb-2">Objeto Equipado</h3>
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
              En <b>Leyendas: Z-A</b> los objetos equipados no se aplican al generar el Pokémon. El bot genera el Pokémon sin objeto.
            </p>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <HeldItemSelector
              selectedItem={heldItem}
              onItemChange={setHeldItem}
            />
          </div>
        )}

        {/* Origin */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <OriginSelector
            selectedOrigin={origin}
            onOriginChange={setOrigin}
            disabledOrigins={disabledOrigins}
          />
        </div>

        {/* Moves */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-black text-gray-900 uppercase mb-4">
            Movimientos
          </h3>
          {isLegendsZA ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-medium text-center">
                En <b>Leyendas: Z-A</b> los ataques se gestionan automáticamente según el nivel y naturaleza del Pokémon dentro del juego. No es necesario elegirlos aquí.
              </p>
            </div>
          ) : (
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
          )}
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
