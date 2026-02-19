'use client'

import React, { useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react'
import { ValidationResult } from '@/lib/pokemon/legalityRules'

interface LegalityPanelProps {
  results: ValidationResult[]
  isLegal: boolean
  errorCount: number
  warningCount: number
}

export function LegalityPanel({ results, isLegal, errorCount, warningCount }: LegalityPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Nothing to show if there are no issues
  if (results.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
        <span className="text-sm font-bold text-green-700">Build legal — listo para agregar al equipo</span>
      </div>
    )
  }

  const panelBorderColor = errorCount > 0 ? 'border-red-300' : 'border-yellow-300'
  const panelBgColor = errorCount > 0 ? 'bg-red-50' : 'bg-yellow-50'
  const headerTextColor = errorCount > 0 ? 'text-red-800' : 'text-yellow-800'

  return (
    <div className={`border-2 ${panelBorderColor} ${panelBgColor} rounded-lg overflow-hidden`}>
      {/* Header — clickable to expand/collapse */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 ${headerTextColor} hover:opacity-80 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          {errorCount > 0 ? (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
          )}
          <span className="text-sm font-black uppercase tracking-wide">
            Problemas de legalidad
          </span>
          <div className="flex items-center gap-2">
            {errorCount > 0 && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-black rounded-full">
                {errorCount} error{errorCount > 1 ? 'es' : ''}
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-black rounded-full">
                {warningCount} aviso{warningCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 shrink-0" />
        )}
      </button>

      {/* Expandable list */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-3 space-y-2">
          {results.map((result) => (
            <div key={result.id} className="flex items-start gap-2">
              {result.severity === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              )}
              <span
                className={`text-xs font-semibold ${
                  result.severity === 'error' ? 'text-red-700' : 'text-yellow-700'
                }`}
              >
                {result.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
