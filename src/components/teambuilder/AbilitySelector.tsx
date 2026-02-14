'use client'

import React, { useState } from 'react'
import { Pokemon } from '@/lib/pokemon/types'
import { ChevronDown, Sparkles } from 'lucide-react'

interface AbilitySelectorProps {
  pokemon: Pokemon | null
  selectedAbility: string
  onAbilityChange: (ability: string) => void
}

export function AbilitySelector({ pokemon, selectedAbility, onAbilityChange }: AbilitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!pokemon) {
    return (
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
          Habilidad
        </label>
        <div className="px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-500 text-center">
          Selecciona un Pokémon primero
        </div>
      </div>
    )
  }

  const abilities = pokemon.abilities.map(a => ({
    name: a.ability.name,
    isHidden: a.is_hidden
  }))

  const formatAbilityName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const currentAbility = abilities.find(a => a.name === selectedAbility)

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
        Habilidad
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-between hover:border-psychic transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            {formatAbilityName(selectedAbility)}
          </span>
          {currentAbility?.isHidden && (
            <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
              <Sparkles className="w-3 h-3" />
              Hidden
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {abilities.map((ability) => (
            <button
              key={ability.name}
              type="button"
              onClick={() => {
                onAbilityChange(ability.name)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center justify-between ${
                selectedAbility === ability.name ? 'bg-purple-100' : ''
              }`}
            >
              <span className={`font-bold ${selectedAbility === ability.name ? 'text-purple-700' : 'text-gray-900'}`}>
                {formatAbilityName(ability.name)}
              </span>
              {ability.isHidden && (
                <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                  <Sparkles className="w-3 h-3" />
                  Hidden
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
