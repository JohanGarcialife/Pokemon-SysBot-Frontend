'use client'

import Image from 'next/image'
import type { GameVersion } from '@/lib/pokemon/types'

interface GameSelectorProps {
  selected: GameVersion
  onSelect: (game: GameVersion) => void
}

interface GameOption {
  id: GameVersion
  name: string
  subtitle: string
  cover: string
  /** Tailwind classes for the selected ring + overlay gradient */
  accent: string
  ring: string
}

const GAMES: GameOption[] = [
  {
    id: 'legends-za',
    name: 'Legends: Z-A',
    subtitle: 'Nintendo Switch · 2025',
    cover: '/cover-legends-za.png',
    accent: 'from-yellow-500/80 to-black/60',
    ring: 'ring-yellow-400',
  },
  {
    id: 'scarlet',
    name: 'Pokémon Escarlata',
    subtitle: 'Nintendo Switch · 2022',
    cover: '/cover-scarlet.png',
    accent: 'from-red-600/80 to-orange-700/60',
    ring: 'ring-red-400',
  },
  {
    id: 'violet',
    name: 'Pokémon Púrpura',
    subtitle: 'Nintendo Switch · 2022',
    cover: '/cover-violet.png',
    accent: 'from-purple-700/80 to-violet-900/60',
    ring: 'ring-purple-400',
  },
]

export default function GameSelector({ selected, onSelect }: GameSelectorProps) {
  return (
    <div className="flex flex-row gap-3">
      {GAMES.map((game) => {
        const isSelected = selected === game.id
        return (
          <button
            key={game.id}
            onClick={() => onSelect(game.id)}
            className={`
              relative flex-1 rounded-2xl overflow-hidden transition-all duration-200 text-left
              ${isSelected
                ? `ring-4 ${game.ring} scale-105 shadow-2xl`
                : 'ring-2 ring-white/10 hover:ring-white/30 hover:scale-102 opacity-80 hover:opacity-100'
              }
            `}
          >
            {/* Cover art */}
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={game.cover}
                alt={`${game.name} cover`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 33vw, 160px"
              />
              {/* Gradient overlay at bottom for text readability */}
              <div className={`absolute inset-0 bg-linear-to-t ${game.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Game name pill */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
              <p className="text-white font-black text-xs uppercase tracking-wide leading-tight truncate drop-shadow-lg">
                {game.name}
              </p>
              <p className="text-white/60 text-[10px] font-medium truncate">
                {game.subtitle}
              </p>
            </div>

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
