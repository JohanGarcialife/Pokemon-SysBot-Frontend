'use client'

import React, { useState, useEffect } from 'react'
import { Move, Pokemon } from '@/lib/pokemon/types'
import { TYPE_COLORS } from '@/lib/pokemon/constants'
import { Search, X } from 'lucide-react'

interface MoveSelectorProps {
  pokemon: Pokemon | null
  onMoveSelect: (move: Move) => void
  onClose: () => void
}

const movesCache = new Map<number, Move[]>()

export function MoveSelector({ pokemon, onMoveSelect, onClose }: MoveSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [moves, setMoves] = useState<Move[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (pokemon) {
      loadMoves()
    }
  }, [pokemon])

  const loadMoves = async () => {
    if (!pokemon) return

    if (movesCache.has(pokemon.id)) {
      setMoves(movesCache.get(pokemon.id)!)
      return
    }

    setLoading(true)
    try {
      // Get first 20 moves for demo (en producción cargarías todos)
      const movePromises = pokemon.moves
        .slice(0, 50) // Limit to 50 moves for performance
        .map(async (m) => {
          const response = await fetch(m.move.url)
          const data = await response.json()
          
          return {
            id: data.id,
            name: data.name,
            type: data.type.name,
            power: data.power,
            accuracy: data.accuracy,
            pp: data.pp,
            damageClass: data.damage_class.name,
            description: data.effect_entries.find((e: any) => e.language.name === 'en')?.short_effect || ''
          } as Move
        })

      const loadedMoves = await Promise.all(movePromises)
      movesCache.set(pokemon.id, loadedMoves)
      setMoves(loadedMoves)
    } catch (error) {
      console.error('Error loading moves:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatMoveName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getDamageClassIcon = (damageClass: string) => {
    switch (damageClass) {
      case 'physical':
        return '⚔️'
      case 'special':
        return '✨'
      case 'status':
        return '🛡️'
      default:
        return ''
    }
  }

  const filteredMoves = moves.filter(move => {
    const matchesSearch = move.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || move.type === selectedType
    const matchesCategory = !selectedCategory || move.damageClass === selectedCategory
    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 uppercase">
            Seleccionar Movimiento
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b-2 border-gray-200 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar movimiento..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-psychic text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded font-bold text-sm ${!selectedCategory ? 'bg-psychic text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('physical')}
              className={`px-3 py-1 rounded font-bold text-sm ${selectedCategory === 'physical' ? 'bg-psychic text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              ⚔️ Físico
            </button>
            <button
              onClick={() => setSelectedCategory('special')}
              className={`px-3 py-1 rounded font-bold text-sm ${selectedCategory === 'special' ? 'bg-psychic text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              ✨ Especial
            </button>
            <button
              onClick={() => setSelectedCategory('status')}
              className={`px-3 py-1 rounded font-bold text-sm ${selectedCategory === 'status' ? 'bg-psychic text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              🛡️ Estado
            </button>
          </div>
        </div>

        {/* Move List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Cargando movimientos...
            </div>
          ) : filteredMoves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron movimientos
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMoves.map((move) => (
                <button
                  key={move.id}
                  onClick={() => {
                    onMoveSelect(move)
                    onClose()
                  }}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg hover:border-psychic hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">
                        {formatMoveName(move.name)}
                      </h4>

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${TYPE_COLORS[move.type] || 'bg-gray-400'} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                          {move.type}
                        </span>
                        <span className="text-xs text-gray-600">
                          {getDamageClassIcon(move.damageClass)} {move.damageClass}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>
                          <span className="font-bold">Poder:</span> {move.power ?? '-'}
                        </span>
                        <span>
                          <span className="font-bold">Precisión:</span> {move.accuracy ?? '-'}
                        </span>
                        <span>
                          <span className="font-bold">PP:</span> {move.pp}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info/buttons */}
        <div className="p-4 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors border-2 border-gray-300 uppercase tracking-wide"
          >
            Atrás / Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
