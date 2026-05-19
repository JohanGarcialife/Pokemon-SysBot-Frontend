import { useState, useEffect, useMemo } from 'react'
import { PokemonBuild } from '@/lib/pokemon/types'
import { validateBuild, isBuildLegal, ValidationResult } from '@/lib/pokemon/legalityRules'
import { pokeAPI } from '@/lib/pokemon/pokeapi'

interface UseLegalityReturn {
  results: ValidationResult[]
  errors: ValidationResult[]
  warnings: ValidationResult[]
  isLegal: boolean
  errorCount: number
  warningCount: number
  loading?: boolean
}

export function useLegality(build: PokemonBuild | null, gameVersion?: string): UseLegalityReturn {
  const [dbResult, setDbResult] = useState<{ valid: boolean; errors: string[] } | null>(null)
  const [loading, setLoading] = useState(false)

  // 1. Run local validation rules
  const localResults = useMemo(() => {
    if (!build) return []
    return validateBuild(build, gameVersion)
  }, [build, gameVersion])

  // 2. Fetch backend database-driven validation if applicable
  useEffect(() => {
    const isZA = gameVersion === 'legends-za'
    const isSV = gameVersion === 'scarlet' || gameVersion === 'violet'

    if (!build || (!isZA && !isSV)) {
      setDbResult(null)
      return
    }

    let active = true
    const validate = async () => {
      setLoading(true)
      try {
        let speciesId = isZA ? build.pokemon.zaSpecies : build.pokemon.svSpecies
        let formId = isZA ? build.pokemon.zaForm : build.pokemon.svForm
        
        if (speciesId === undefined) {
          const info = isZA 
            ? await pokeAPI.getZAPokemonInfo(build.pokemon.name)
            : await pokeAPI.getSVPokemonInfo(build.pokemon.name)
          if (info) {
            speciesId = info.species
            formId = info.form
          }
        }

        if (speciesId === undefined) {
          setDbResult({ 
            valid: false, 
            errors: [`Pokémon no disponible en la base de datos de ${isZA ? 'Legends: Z-A' : 'Scarlet / Violet'}`] 
          })
          setLoading(false)
          return
        }

        const baseURL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:4000'
          : (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pkdex-backend-production.up.railway.app')

        const endpoint = isZA ? '/api/za/validate' : '/api/sv/validate'
        const response = await fetch(`${baseURL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            species: speciesId,
            form: formId,
            level: build.level,
            pokeball: build.pokeball,
            shiny: build.shiny,
            alpha: build.alpha,
            gender: build.gender === 'male' ? 'Male' : build.gender === 'female' ? 'Female' : 'Genderless',
            teraType: build.teraType
          })
        })

        if (!response.ok) throw new Error('Legality API request failed')
        const data = await response.json()
        if (active) {
          setDbResult(data)
        }
      } catch (err) {
        console.error('Error fetching database validation:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    const timer = setTimeout(validate, 200)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [build, gameVersion])

  const results = useMemo(() => {
    const list = [...localResults]
    if (dbResult) {
      if (!dbResult.valid) {
        dbResult.errors.forEach((err, i) => {
          list.push({
            id: `db-backend-err-${i}`,
            severity: 'error',
            field: 'general',
            message: err
          })
        })
      }
    }
    return list
  }, [localResults, dbResult, gameVersion])

  const errors = useMemo(() => results.filter((r) => r.severity === 'error'), [results])
  const warnings = useMemo(() => results.filter((r) => r.severity === 'warning'), [results])

  return {
    results,
    errors,
    warnings,
    isLegal: isBuildLegal(results),
    errorCount: errors.length,
    warningCount: warnings.length,
    loading
  }
}
