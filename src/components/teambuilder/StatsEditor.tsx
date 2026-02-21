'use client'

import React, { useState } from 'react'
import { StatSlider } from './StatSlider'
import { PokemonStats } from '@/lib/pokemon/types'
import { STAT_LIMITS } from '@/lib/pokemon/constants'

interface StatsEditorProps {
  stats: PokemonStats
  onStatsChange: (stats: PokemonStats) => void
}

export function StatsEditor({ stats, onStatsChange }: StatsEditorProps) {
  const totalEVs = Object.values(stats).reduce((sum, stat) => sum + stat.ev, 0)
  const isEVLimitReached = totalEVs >= STAT_LIMITS.EV_TOTAL_MAX

  const handleStatchange = (statKey: keyof PokemonStats, field: 'iv' | 'ev', value: number) => {
    if (field === 'ev') {
      // Check if adding EVs would exceed total limit
      const currentEV = stats[statKey].ev
      const difference = value - currentEV
      const newTotal = totalEVs + difference

      if (newTotal > STAT_LIMITS.EV_TOTAL_MAX) {
        // Don't allow if it exceeds total
        return
      }
    }

    onStatsChange({
      ...stats,
      [statKey]: {
        ...stats[statKey],
        [field]: value
      }
    })
  }

  const handleMaxIVs = () => {
    const newStats: PokemonStats = {
      hp: { ...stats.hp, iv: 31 },
      attack: { ...stats.attack, iv: 31 },
      defense: { ...stats.defense, iv: 31 },
      spAttack: { ...stats.spAttack, iv: 31 },
      spDefense: { ...stats.spDefense, iv: 31 },
      speed: { ...stats.speed, iv: 31 }
    }
    onStatsChange(newStats)
  }

  const handleResetEVs = () => {
    const newStats: PokemonStats = {
      hp: { ...stats.hp, ev: 0 },
      attack: { ...stats.attack, ev: 0 },
      defense: { ...stats.defense, ev: 0 },
      spAttack: { ...stats.spAttack, ev: 0 },
      spDefense: { ...stats.spDefense, ev: 0 },
      speed: { ...stats.speed, ev: 0 }
    }
    onStatsChange(newStats)
  }

  return (
    <div className="space-y-4">
      {/* Header con botones de acción */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900 uppercase">
          Estadísticas
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleMaxIVs}
            className="px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Max IVs
          </button>
          <button
            onClick={handleResetEVs}
            className="px-3 py-1 text-xs font-bold text-white bg-gray-500 rounded hover:bg-gray-600 transition-colors"
          >
            Reset EVs
          </button>
        </div>
      </div>

      {/* Explicación Noob-Friendly */}
      <div className="grid grid-cols-2 gap-4 text-xs mt-2">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg shadow-sm">
          <strong className="text-blue-800 block mb-1">🧬 IVs (Potencial Genético)</strong>
          <p className="text-blue-600">Representan la genética inalterable del Pokémon. Por regla general, querrás que todos estén al máximo (31) para ser competitivo.</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg shadow-sm">
          <strong className="text-green-800 block mb-1">💪 EVs (Entrenamiento)</strong>
          <p className="text-green-600">Puntos adicionales. Tienes un límite de <span className="font-bold">510</span>. Se sugiere maximizar (252) las dos estadísticas más importantes.</p>
        </div>
      </div>

      {/* Total EVs contador */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
        <span className="text-sm font-bold text-gray-700">
          Total EVs
        </span>
        <span className={`text-lg font-black ${totalEVs >= STAT_LIMITS.EV_TOTAL_MAX ? 'text-red-500' : 'text-gray-900'}`}>
          {totalEVs} / {STAT_LIMITS.EV_TOTAL_MAX}
        </span>
      </div>

      {/* Sliders de stats */}
      <div className="space-y-4">
        <StatSlider
          statKey="hp"
          iv={stats.hp.iv}
          ev={stats.hp.ev}
          onIVChange={(value) => handleStatchange('hp', 'iv', value)}
          onEVChange={(value) => handleStatchange('hp', 'ev', value)}
        />
        
        <StatSlider
          statKey="attack"
          iv={stats.attack.iv}
          ev={stats.attack.ev}
          onIVChange={(value) => handleStatchange('attack', 'iv', value)}
          onEVChange={(value) => handleStatchange('attack', 'ev', value)}
        />
        
        <StatSlider
          statKey="defense"
          iv={stats.defense.iv}
          ev={stats.defense.ev}
          onIVChange={(value) => handleStatchange('defense', 'iv', value)}
          onEVChange={(value) => handleStatchange('defense', 'ev', value)}
        />
        
        <StatSlider
          statKey="spAttack"
          iv={stats.spAttack.iv}
          ev={stats.spAttack.ev}
          onIVChange={(value) => handleStatchange('spAttack', 'iv', value)}
          onEVChange={(value) => handleStatchange('spAttack', 'ev', value)}
        />
        
        <StatSlider
          statKey="spDefense"
          iv={stats.spDefense.iv}
          ev={stats.spDefense.ev}
          onIVChange={(value) => handleStatchange('spDefense', 'iv', value)}
          onEVChange={(value) => handleStatchange('spDefense', 'ev', value)}
        />
        
        <StatSlider
          statKey="speed"
          iv={stats.speed.iv}
          ev={stats.speed.ev}
          onIVChange={(value) => handleStatchange('speed', 'iv', value)}
          onEVChange={(value) => handleStatchange('speed', 'ev', value)}
        />
      </div>

      {/* Warning si se alcanza el límite */}
      {isEVLimitReached && (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm font-bold text-red-700">
            ⚠️ Límite de EVs alcanzado (510)
          </p>
        </div>
      )}
    </div>
  )
}
