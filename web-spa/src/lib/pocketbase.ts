import PocketBase, { RecordModel } from 'pocketbase'

export const pb = new PocketBase('http://localhost:8090')

export interface GameRoom extends RecordModel {
  name: string
  players: number
  maxPlayers: number
  status: 'waiting' | 'playing' | 'finished'
}
