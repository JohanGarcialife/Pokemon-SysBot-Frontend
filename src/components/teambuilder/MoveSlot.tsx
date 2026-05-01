'use client'

import React from 'react'
import { Move } from '@/lib/pokemon/types'
import { TYPE_COLORS } from '@/lib/pokemon/constants'
import { X, Plus } from 'lucide-react'

interface MoveSlotProps {
  moveIndex: number
  move: Move | null
  onSelect: () => void
  onRemove: () => void
  /** When true, the slot is read-only (event moveset). Buttons are hidden. */
  locked?: boolean
}

export function MoveSlot({ moveIndex, move, onSelect, onRemove, locked = false }: MoveSlotProps) {
  if (!move) {
    return (
      <button
        type="button"
        onClick={locked ? undefined : onSelect}
        disabled={locked}
        className={`w-full p-4 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-colors ${
          locked
            ? 'border-amber-300 bg-amber-50 text-amber-500 cursor-default'
            : 'border-gray-300 hover:border-psychic hover:bg-gray-50 text-gray-500 cursor-pointer'
        }`}
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold">{locked ? `Movimiento ${moveIndex + 1} (evento)` : `Agregar Movimiento ${moveIndex + 1}`}</span>
      </button>
    )
  }

  const formatMoveName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getDamageClassIcon = (damageClass: string) => {
    switch (damageClass) {
      case 'physical':
        return '⚔️'
      case 'special':
        return '✨'
      case 'status':
        return '🛡️'
      default:
        return ''
    }
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={locked ? undefined : onSelect}
        disabled={locked}
        className={`w-full p-3 border-2 rounded-lg transition-colors text-left ${
          locked
            ? 'bg-amber-50 border-amber-300 cursor-default'
            : 'bg-white border-gray-300 hover:border-psychic cursor-pointer'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Move Name and Number */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-gray-500">#{moveIndex + 1}</span>
              <span className="font-bold text-gray-900">
                {formatMoveName(move.name)}
              </span>
              {locked && (
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                  🎁 evento
                </span>
              )}
            </div>

            {/* Type and Damage Class */}
            <div className="flex items-center gap-2">
              <span className={`${TYPE_COLORS[move.type] || 'bg-gray-400'} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                {move.type}
              </span>
              <span className="text-xs text-gray-600">
                {getDamageClassIcon(move.damageClass)} {move.damageClass}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
              <span>
                <span className="font-bold">Poder:</span> {move.power ?? '-'}
              </span>
              <span>
                <span className="font-bold">Precisión:</span> {move.accuracy ?? '-'}
              </span>
              <span>
                <span className="font-bold">PP:</span> {move.pp}
              </span>
            </div>
          </div>

          {/* Remove Button — hidden when locked */}
          {!locked && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </button>
    </div>
  )
}

