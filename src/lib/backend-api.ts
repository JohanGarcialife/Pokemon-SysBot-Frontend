import { GameVersion } from '@/lib/pokemon/types'

/**
 * Returns the correct backend URL at call time.
 * - Browser on localhost → always local backend (localhost:4000)
 * - Any other host → NEXT_PUBLIC_BACKEND_URL env var (production)
 *
 * Using a function (not a module-level constant) means the URL is
 * re-evaluated on every request, so old dev servers with a stale
 * env var will still route correctly.
 */
function getBackendURL(): string {
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    if (isLocalhost) return 'http://localhost:4000'
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
}

export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export interface StatValues {
  hp: number
  attack: number
  defense: number
  spAttack: number
  spDefense: number
  speed: number
}

export interface PokemonBuildPayload {
  species: string
  level: number
  nature: string
  ability: string
  shiny: boolean
  gender: string
  heldItem: string
  teraType: string
  pokeball: string
  origin: string
  moves: string[]
  ivs: StatValues
  evs: StatValues
}

export interface CreateOrderRequest {
  team: PokemonBuildPayload[]
  tradeCode: string
  gameVersion: GameVersion
}

export interface CreateOrderResponse {
  orderId: string
  tradeCode: string
  status: 'pending'
  createdAt: string
}

/**
 * API Client for backend requests
 */
export class BackendAPI {
  /** Resolved at call time to avoid stale env-var issues */
  private static get baseURL() { return getBackendURL() }

  /**
   * Health check endpoint
   */
  static async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`)
      return await response.json()
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  /**
   * Validate Pokemon data
   */
  static async validatePokemon(pokemonData: unknown) {
    try {
      const response = await fetch(`${this.baseURL}/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pokemonData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Pokemon validation failed:', error)
      throw error
    }
  }

  /**
   * Create a new trade order (requires auth token)
   */
  static async createOrder(
    data: CreateOrderRequest,
    jwtToken: string
  ): Promise<CreateOrderResponse> {
    const url = `${this.baseURL}/api/orders`
    console.log('[BackendAPI] POST', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody?.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  /**
   * Get the user's orders (requires auth token)
   */
  static async getOrders(jwtToken: string) {
    const response = await fetch(`${this.baseURL}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  /**
   * Generic GET request
   */
  static async get(endpoint: string) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error)
      throw error
    }
  }

  /**
   * Generic POST request
   */
  static async post(endpoint: string, data: unknown) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error)
      throw error
    }
  }
}
