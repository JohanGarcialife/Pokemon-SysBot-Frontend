'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Copy, Check, Clock, Gamepad2 } from 'lucide-react'

interface TradeCodeModalProps {
  isOpen: boolean
  onClose: () => void
  pokemonName?: string
}

function generateTradeCode(): string {
  const part1 = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  const part2 = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `${part1} ${part2}`
}

const EXPIRATION_SECONDS = 180 // 3 minutes

export function TradeCodeModal({ isOpen, onClose, pokemonName }: TradeCodeModalProps) {
  const [tradeCode, setTradeCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(EXPIRATION_SECONDS)
  const [expired, setExpired] = useState(false)

  const generateNewCode = useCallback(() => {
    setTradeCode(generateTradeCode())
    setTimeLeft(EXPIRATION_SECONDS)
    setExpired(false)
    setCopied(false)
  }, [])

  // Generate code on open
  useEffect(() => {
    if (isOpen) {
      generateNewCode()
    }
  }, [isOpen, generateNewCode])

  // Countdown timer
  useEffect(() => {
    if (!isOpen || expired) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, expired])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tradeCode.replace(' ', ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header - gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8" />
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Código de Intercambio
            </h2>
          </div>
          {pokemonName && (
            <p className="text-white/80 text-sm">
              Tu <span className="font-bold text-white">{pokemonName}</span> está listo para el intercambio
            </p>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Trade Code Display */}
          <div className="text-center">
            <div className={`
              inline-flex items-center gap-4 px-8 py-5 rounded-xl
              ${expired ? 'bg-red-50 border-2 border-red-300' : 'bg-gray-50 border-2 border-gray-300'}
            `}>
              <span className={`
                text-5xl font-black tracking-[0.2em] font-mono
                ${expired ? 'text-red-400 line-through' : 'text-gray-900'}
              `}>
                {tradeCode}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2">
            <Clock className={`w-4 h-4 ${expired ? 'text-red-500' : timeLeft <= 30 ? 'text-orange-500' : 'text-gray-400'}`} />
            {expired ? (
              <span className="text-red-500 font-bold text-sm">Código expirado</span>
            ) : (
              <span className={`font-bold text-sm ${timeLeft <= 30 ? 'text-orange-500' : 'text-gray-500'}`}>
                Expira en {formatTime(timeLeft)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              disabled={expired}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm uppercase transition-all
                ${expired
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }
              `}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '¡Copiado!' : 'Copiar Código'}
            </button>

            {expired && (
              <button
                onClick={generateNewCode}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-sm uppercase hover:bg-blue-700 transition-colors"
              >
                Generar Nuevo
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-black text-blue-900 uppercase text-sm mb-3">
              📋 Instrucciones
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-black text-blue-600 shrink-0">1.</span>
                <span>Abre <strong>Pokémon Escarlata/Púrpura</strong> en tu Nintendo Switch</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-blue-600 shrink-0">2.</span>
                <span>Ve al <strong>Poké Portal</strong> → <strong>Intercambio con Código</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-blue-600 shrink-0">3.</span>
                <span>Ingresa el código: <strong className="font-mono">{tradeCode}</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-blue-600 shrink-0">4.</span>
                <span>Espera la conexión y <strong>acepta el intercambio</strong></span>
              </li>
            </ol>
          </div>

          {/* Warning */}
          <p className="text-center text-xs text-gray-400">
            El código expira en 3 minutos. Si expira, genera uno nuevo.
          </p>
        </div>
      </div>
    </div>
  )
}
