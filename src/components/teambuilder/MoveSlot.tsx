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
}

export function MoveSlot({ moveIndex, move, onSelect, onRemove }: MoveSlotProps) {
  if (!move) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-psychic hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-500"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold">Agregar Movimiento {moveIndex + 1}</span>
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
        onClick={onSelect}
        className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg hover:border-psychic transition-colors text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Move Name and Number */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-gray-500">#{moveIndex + 1}</span>
              <span className="font-bold text-gray-900">
                {formatMoveName(move.name)}
              </span>
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

          {/* Remove Button */}
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
        </div>
      </button>
    </div>
  )
}
