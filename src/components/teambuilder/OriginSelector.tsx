'use client'

import { ORIGINS } from '@/lib/pokemon/constants'

interface OriginSelectorProps {
  selectedOrigin: string
  onOriginChange: (origin: string) => void
  disabledOrigins?: string[]
}

export function OriginSelector({ selectedOrigin, onOriginChange, disabledOrigins = [] }: OriginSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
        Origen
      </label>

      <div className="grid grid-cols-2 gap-2">
        {ORIGINS.map((origin) => {
          if (disabledOrigins.includes(origin.name)) return null;

          return (
            <button
              key={origin.name}
              type="button"
              onClick={() => onOriginChange(origin.name)}
              className={`
                flex items-center gap-3 p-3 rounded-lg text-left
                transition-all duration-200
                ${selectedOrigin === origin.name
                  ? 'ring-3 ring-yellow-400 ring-offset-1 bg-blue-50 shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <span className="text-2xl shrink-0">{origin.emoji}</span>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm">{origin.label}</p>
                <p className="text-[11px] text-gray-500 truncate">{origin.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
