/**
 * Backend API Configuration
 */
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
  gameVersion: 'scarlet' | 'violet'
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
  private static baseURL = BACKEND_API_URL

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
    const response = await fetch(`${this.baseURL}/api/orders`, {
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
