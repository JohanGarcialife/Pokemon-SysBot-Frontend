import React from 'react'
import { STAT_COLORS, STAT_LABELS, STAT_LIMITS } from '@/lib/pokemon/constants'
import { PokemonStats } from '@/lib/pokemon/types'

interface StatSliderProps {
  statKey: keyof PokemonStats
  iv: number
  ev: number
  onIVChange: (value: number) => void
  onEVChange: (value: number) => void
}

export function StatSlider({ statKey, iv, ev, onIVChange, onEVChange }: StatSliderProps) {
  const colors = STAT_COLORS[statKey]
  const label = STAT_LABELS[statKey]

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${colors.text} uppercase`}>
          {label}
        </span>
        <div className="flex gap-3 text-xs">
          <span className="text-gray-600">
            IV: <span className="font-bold text-gray-900">{iv}</span>
          </span>
          <span className="text-gray-600">
            EV: <span className="font-bold text-gray-900">{ev}</span>
          </span>
        </div>
      </div>

      {/* IV Slider */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">IVs (0-31)</label>
        <input
          type="range"
          min={STAT_LIMITS.IV_MIN}
          max={STAT_LIMITS.IV_MAX}
          value={iv}
          onChange={(e) => onIVChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-iv"
          style={{
            background: `linear-gradient(to right, ${getGradientColor(colors.gradient)} 0%, ${getGradientColor(colors.gradient)} ${(iv / STAT_LIMITS.IV_MAX) * 100}%, #e5e7eb ${(iv / STAT_LIMITS.IV_MAX) * 100}%, #e5e7eb 100%)`
          }}
        />
      </div>

      {/* EV Slider */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">EVs (0-252)</label>
        <input
          type="range"
          min={STAT_LIMITS.EV_MIN}
          max={STAT_LIMITS.EV_MAX}
          value={ev}
          onChange={(e) => onEVChange(Number(e.target.value))}
          step={4}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-ev"
          style={{
            background: `linear-gradient(to right, ${getGradientColor(colors.gradient)} 0%, ${getGradientColor(colors.gradient)} ${(ev / STAT_LIMITS.EV_MAX) * 100}%, #e5e7eb ${(ev / STAT_LIMITS.EV_MAX) * 100}%, #e5e7eb 100%)`
          }}
        />
      </div>
    </div>
  )
}

function getGradientColor(gradient: string): string {
  // Extract color from Tailwind gradient class
  const colorMap: Record<string, string> = {
    'from-red-400 to-red-600': '#f87171',
    'from-orange-400 to-orange-600': '#fb923c',
    'from-yellow-400 to-yellow-600': '#facc15',
    'from-blue-400 to-blue-600': '#60a5fa',
    'from-green-400 to-green-600': '#4ade80',
    'from-pink-400 to-pink-600': '#f472b6'
  }
  return colorMap[gradient] || '#6366f1'
}
