'use client'

import { POKE_BALLS } from '@/lib/pokemon/constants'

interface PokeBallSelectorProps {
  selectedBall: string
  onBallChange: (ball: string) => void
}

export function PokeBallSelector({ selectedBall, onBallChange }: PokeBallSelectorProps) {
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
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg
              transition-all duration-200 text-center
              ${selectedBall === ball.name
                ? 'ring-3 ring-yellow-400 ring-offset-1 bg-blue-50 scale-105 shadow-md'
                : 'bg-gray-50 hover:bg-gray-100 hover:scale-105 border border-gray-200'
              }
            `}
          >
            <span className="text-xl mb-1">{ball.emoji}</span>
            <span className="text-[10px] font-bold text-gray-700 leading-tight truncate w-full">
              {ball.name.replace(' Ball', '')}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Display */}
      <div className="mt-3 p-3 bg-white rounded-lg border-2 border-gray-300 flex items-center gap-3">
        <span className="text-2xl">
          {POKE_BALLS.find(b => b.name === selectedBall)?.emoji || '🔴'}
        </span>
        <div>
          <span className="text-sm font-bold text-gray-700">Seleccionada: </span>
          <span className="font-black text-gray-900">{selectedBall}</span>
        </div>
      </div>
    </div>
  )
}
