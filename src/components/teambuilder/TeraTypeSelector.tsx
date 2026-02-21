'use client'

import React from 'react'
import { TERA_TYPES, TYPE_COLORS, TYPE_TRANSLATIONS } from '@/lib/pokemon/constants'

interface TeraTypeSelectorProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

// Types that need dark text due to light backgrounds
const LIGHT_BG_TYPES = ['electric', 'ice', 'fairy', 'normal', 'flying']

export function TeraTypeSelector({ selectedType, onTypeChange }: TeraTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
        Teratipo
      </label>

      <div className="grid grid-cols-3 gap-2">
        {TERA_TYPES.map((type) => {
          const isLightBg = LIGHT_BG_TYPES.includes(type)
          const textColor = isLightBg ? 'text-gray-900' : 'text-white'
          
          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`
                px-3 py-2 rounded-lg font-bold text-sm uppercase
                transition-all duration-200
                ${TYPE_COLORS[type as keyof typeof TYPE_COLORS]}
                ${textColor}
                ${selectedType === type 
                  ? 'ring-4 ring-offset-2 ring-yellow-400 scale-105 shadow-lg' 
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
                }
              `}
            >
              {TYPE_TRANSLATIONS[type] || type}
            </button>
          )
        })}
      </div>

      {/* Selected Type Display */}
      <div className="mt-3 p-3 bg-white rounded-lg border-2 border-gray-300">
        <span className="text-sm font-bold text-gray-700">Teratipo seleccionado: </span>
        <span className="inline-flex items-center gap-2 font-bold uppercase text-gray-900 px-3 py-1 bg-gray-100 rounded border-2 border-gray-300 ml-2">
          <span className={`w-3 h-3 rounded-full ${TYPE_COLORS[selectedType as keyof typeof TYPE_COLORS]}`} />
          {TYPE_TRANSLATIONS[selectedType] || selectedType}
        </span>
      </div>
    </div>
  )
}
