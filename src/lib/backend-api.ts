/**
 * Backend API Configuration
 */
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

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
  static async validatePokemon(pokemonData: any) {
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
  static async post(endpoint: string, data: any) {
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
