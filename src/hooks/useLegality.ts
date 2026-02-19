'use client'

import { useMemo } from 'react'
import { PokemonBuild } from '@/lib/pokemon/types'
import { validateBuild, isBuildLegal, ValidationResult } from '@/lib/pokemon/legalityRules'

interface UseLegalityReturn {
  results: ValidationResult[]
  errors: ValidationResult[]
  warnings: ValidationResult[]
  isLegal: boolean
  errorCount: number
  warningCount: number
}

/**
 * useLegality
 *
 * Runs all legality rules on the provided build and returns structured results.
 * Uses useMemo so rules only re-run when the build actually changes.
 */
export function useLegality(build: PokemonBuild | null): UseLegalityReturn {
  const results = useMemo(() => {
    if (!build) return []
    return validateBuild(build)
  }, [build])

  const errors = useMemo(() => results.filter((r) => r.severity === 'error'), [results])
  const warnings = useMemo(() => results.filter((r) => r.severity === 'warning'), [results])

  return {
    results,
    errors,
    warnings,
    isLegal: isBuildLegal(results),
    errorCount: errors.length,
    warningCount: warnings.length,
  }
}
