'use client'

import { useState } from 'react'
import { HELD_ITEMS } from '@/lib/pokemon/constants'
import { Search } from 'lucide-react'

interface HeldItemSelectorProps {
  selectedItem: string
  onItemChange: (item: string) => void
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  competitive: { label: 'Competitivo', color: 'bg-red-100 text-red-700' },
  berry: { label: 'Baya', color: 'bg-green-100 text-green-700' },
  evolution: { label: 'Evolución', color: 'bg-blue-100 text-blue-700' },
  other: { label: 'Otro', color: 'bg-gray-100 text-gray-700' },
}

export function HeldItemSelector({ selectedItem, onItemChange }: HeldItemSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredItems = HELD_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const selectedItemData = HELD_ITEMS.find(i => i.name === selectedItem)

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
        Objeto Equipado
      </label>

      {/* Selected Item Display / Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-400 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🎒</span>
          <div>
            <p className="font-bold text-gray-900">
              {selectedItem || 'Seleccionar objeto...'}
            </p>
            {selectedItemData && (
              <p className="text-xs text-gray-500">{selectedItemData.description}</p>
            )}
          </div>
        </div>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden z-10 relative">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar objeto..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-1 p-2 border-b border-gray-200 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                !activeCategory ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  activeCategory === key ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onItemChange(item.name)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={`w-full text-left px-4 py-2.5 hover:bg-purple-50 transition-colors flex items-center justify-between ${
                  selectedItem === item.name ? 'bg-purple-100' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>
                <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${CATEGORY_LABELS[item.category]?.color}`}>
                  {CATEGORY_LABELS[item.category]?.label}
                </span>
              </button>
            ))}
            {filteredItems.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-500 text-center">No se encontraron objetos</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
