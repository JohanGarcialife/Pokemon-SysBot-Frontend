'use client'

import Image from 'next/image'
import { POKE_BALLS } from '@/lib/pokemon/constants'

function getBallSpriteUrl(name: string) {
  const formattedName = name.toLowerCase().replace('é', 'e').replace(' ', '-')
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${formattedName}.png`
}

interface PokeBallSelectorProps {
  selectedBall: string
  onBallChange: (ball: string) => void
  disabled?: boolean
}

export function PokeBallSelector({ selectedBall, onBallChange, disabled }: PokeBallSelectorProps) {
  const selectedBallData = POKE_BALLS.find(b => b.name === selectedBall)
  const displayLabel = selectedBallData?.label || selectedBall

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
        Poké Ball
      </label>

      <div className="grid grid-cols-5 gap-2">
        {POKE_BALLS.map((ball) => (
          <button
            key={ball.name}
            type="button"
            onClick={() => onBallChange(ball.name)}
            title={ball.name}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg
              transition-all duration-200 text-center
              ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
              ${!disabled && selectedBall === ball.name
                ? 'ring-3 ring-yellow-400 ring-offset-1 bg-blue-50 scale-105 shadow-md'
                : !disabled ? 'bg-gray-50 hover:bg-gray-100 hover:scale-105 border border-gray-200' : 'bg-gray-50 border border-gray-200 ring-3 ring-gray-300'
              }
            `}
          >
            <div className="relative w-8 h-8 mb-1">
              <Image 
                src={getBallSpriteUrl(ball.name)}
                alt={ball.name}
                fill
                className="object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                unoptimized
              />
            </div>
            <span className="text-[10px] font-bold text-gray-700 leading-tight truncate w-full">
              {(ball as any).label ? (ball as any).label.replace(' Ball', '') : ball.name.replace(' Ball', '')}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Display */}
      <div className="mt-3 p-3 bg-white rounded-lg border-2 border-gray-300 flex items-center gap-3">
        <div className="relative w-10 h-10">
          <Image 
            src={getBallSpriteUrl(selectedBall)}
            alt={selectedBall}
            fill
            className="object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
            unoptimized
          />
        </div>
        <div>
          <span className="text-sm font-bold text-gray-700">Seleccionada: </span>
          <span className="font-black text-gray-900">{displayLabel}</span>
        </div>
      </div>
    </div>
  )
}
