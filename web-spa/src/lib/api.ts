import { Level } from './game/logic'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function getRandomLevel(): Promise<Level> {
  const response = await fetch(`${API_BASE_URL}/levels/random`)
  if (!response.ok) {
    throw new Error('Failed to fetch random level')
  }
  return response.json()
}

export async function getLevelById(id: string): Promise<Level> {
  const response = await fetch(`${API_BASE_URL}/levels/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch level by id')
  }
  return response.json()
}

interface Player {
  id: number
  rating: number
  newRating?: number
  dnf: boolean
  finishTime?: number
}

export async function calculateEloChanges(players: Player[]): Promise<Player[]> {
  const response = await fetch(`${API_BASE_URL}/elo/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ players }),
  })
  if (!response.ok) {
    throw new Error('Failed to calculate Elo changes')
  }
  return response.json()
}
