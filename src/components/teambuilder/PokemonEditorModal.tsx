'use client'

import React, { useEffect, useState } from 'react'
import { Pokemon, PokemonBuild, GameVersion } from '@/lib/pokemon/types'
import { PokemonEditor } from './PokemonEditor'
import { X, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react'
import { isPokemonInGame, getGameDisplayName } from '@/lib/pokemon/gameAvailability'

interface PokemonEditorModalProps {
  pokemon: Pokemon | null
  isOpen: boolean
  onClose: () => void
  onAddToTeam: (build: PokemonBuild) => void
  gameVersion?: GameVersion
}

type AvailabilityState = 'loading' | 'available' | 'unavailable' | 'unknown'

export function PokemonEditorModal({
  pokemon,
  isOpen,
  onClose,
  onAddToTeam,
  gameVersion,
}: PokemonEditorModalProps) {
  const [availability, setAvailability] = useState<AvailabilityState>('loading')

  // Check availability whenever the pokemon or game changes
  useEffect(() => {
    if (!pokemon || !gameVersion) { setAvailability('available'); return }

    setAvailability('loading')
    isPokemonInGame(pokemon.name, gameVersion)
      .then((result) => {
        if (result === null) setAvailability('unknown')
        else if (result) setAvailability('available')
        else setAvailability('unavailable')
      })
      .catch(() => setAvailability('unknown'))
  }, [pokemon?.name, gameVersion])

  if (!isOpen || !pokemon) return null

  const gameName = gameVersion ? getGameDisplayName(gameVersion) : ''

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-gray-100 w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            Personalizar Pokémon
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ── Availability Banner ── */}
        {gameVersion && availability !== 'available' && (
          <div
            className={`
              flex items-center gap-3 px-6 py-3 text-sm font-medium shrink-0 border-b
              ${availability === 'unavailable'
                ? 'bg-red-50 border-red-200 text-red-800'
                : availability === 'unknown'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }
            `}
          >
            {availability === 'unavailable' && (
              <>
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>
                  <strong className="capitalize">{pokemon.name}</strong> no está disponible en{' '}
                  <strong>{gameName}</strong>. Puedes configurarlo, pero el bot no podrá entregarlo.
                </span>
              </>
            )}
            {availability === 'unknown' && (
              <>
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>
                  No podemos verificar si <strong className="capitalize">{pokemon.name}</strong> está
                  disponible en <strong>{gameName}</strong> — la Pokédex de este juego aún no está
                  en nuestra base de datos. Verifica antes de solicitar el intercambio.
                </span>
              </>
            )}
            {availability === 'loading' && (
              <>
                <AlertTriangle className="w-5 h-5 text-gray-400 animate-pulse shrink-0" />
                <span>Verificando disponibilidad en {gameName}…</span>
              </>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 relative">
          <PokemonEditor pokemon={pokemon} onAddToTeam={onAddToTeam} />
        </div>
      </div>
    </div>
  )
}
