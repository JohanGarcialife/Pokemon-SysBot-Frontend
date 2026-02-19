'use client'

import type { GameVersion } from '@/lib/pokemon/types'

interface GameSelectorProps {
  selected: GameVersion
  onSelect: (game: GameVersion) => void
}

export default function GameSelector({ selected, onSelect }: GameSelectorProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onSelect('scarlet')}
        className={`
          flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-wide transition-all
          ${selected === 'scarlet'
            ? 'bg-linear-to-r from-fire to-orange-600 text-white shadow-lg scale-105'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
      >
        🔴 Scarlet
      </button>
      <button
        onClick={() => onSelect('violet')}
        className={`
          flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-wide transition-all
          ${selected === 'violet'
            ? 'bg-linear-to-r from-purple-600 to-purple-800 text-white shadow-lg scale-105'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
      >
        🟣 Violet
      </button>
    </div>
  )
}
