import PocketBase, { RecordModel } from 'pocketbase'

export const pb = new PocketBase('http://localhost:8090')

export interface GameRoom extends RecordModel {
  name: string
  players: Array<Player>
  maxPlayers: number
  status: 'waiting' | 'playing' | 'finished'
}

export interface Player extends RecordModel {
  username: string
  avatar: string
}
