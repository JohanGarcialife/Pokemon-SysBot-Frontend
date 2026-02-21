'use client'

import React, { useState } from 'react'
import { Nature, PokemonStats } from '@/lib/pokemon/types'
import { NATURES } from '@/lib/pokemon/constants'
import { ChevronDown } from 'lucide-react'

interface NatureSelectorProps {
  selectedNature: Nature
  onNatureChange: (nature: Nature) => void
}

export function NatureSelector({ selectedNature, onNatureChange }: NatureSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNatures = NATURES.filter(nature =>
    nature.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (nature.label && nature.label.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getNatureEffect = (nature: Nature) => {
    if (!nature.increase || !nature.decrease) {
      return <span className="text-gray-500 text-sm">Neutral</span>
    }

    const stats: Record<keyof PokemonStats, string> = {
      hp: 'HP',
      attack: 'ATK',
      defense: 'DEF',
      spAttack: 'SP.ATK',
      spDefense: 'SP.DEF',
      speed: 'SPE'
    }

    return (
      <span className="text-xs">
        <span className="text-green-600 font-bold">+{stats[nature.increase]}</span>
        {' / '}
        <span className="text-red-600 font-bold">-{stats[nature.decrease]}</span>
      </span>
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
        Naturaleza
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-between hover:border-psychic transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900">{selectedNature.label || selectedNature.name}</span>
          {getNatureEffect(selectedNature)}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Bar */}
          <div className="p-2 border-b-2 border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar naturaleza..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-psychic text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Nature List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredNatures.map((nature) => (
              <button
                key={nature.name}
                type="button"
                onClick={() => {
                  onNatureChange(nature)
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center justify-between ${
                  selectedNature.name === nature.name ? 'bg-psychic bg-opacity-10' : ''
                }`}
              >
                <span className={`font-bold ${selectedNature.name === nature.name ? 'text-psychic' : 'text-gray-900'}`}>
                  {nature.label || nature.name}
                </span>
                {getNatureEffect(nature)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
