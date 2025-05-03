import { GameStatus, PlayerStatus } from './enums'
import { QueenRoomState as GeneratedQueenRoomState } from './QueenRoomState'
import { Player as GeneratedPlayer } from './Player'

export interface Player extends GeneratedPlayer {
  status: PlayerStatus
}

export interface QueenRoomState extends GeneratedQueenRoomState {
  status: GameStatus
}
