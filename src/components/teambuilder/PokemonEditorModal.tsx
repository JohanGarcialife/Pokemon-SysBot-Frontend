'use client'

import React from 'react'
import { Pokemon, PokemonBuild } from '@/lib/pokemon/types'
import { PokemonEditor } from './PokemonEditor'
import { X } from 'lucide-react'

interface PokemonEditorModalProps {
  pokemon: Pokemon | null
  isOpen: boolean
  onClose: () => void
  onAddToTeam: (build: PokemonBuild) => void
}

export function PokemonEditorModal({ pokemon, isOpen, onClose, onAddToTeam }: PokemonEditorModalProps) {
  if (!isOpen || !pokemon) return null

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

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 relative">
          <PokemonEditor pokemon={pokemon} onAddToTeam={onAddToTeam} />
        </div>
      </div>
    </div>
  )
}
