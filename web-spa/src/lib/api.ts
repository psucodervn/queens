import { Level } from './game/logic'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api'

export async function getRandomLevel(): Promise<Level> {
  const response = await fetch(`${API_BASE_URL}/levels/random`)
  if (!response.ok) {
    throw new Error('Failed to fetch random level')
  }
  return response.json()
}
