import { GameStatus, PlayerStatus } from './enums'
import { Player as GeneratedPlayer } from './generated/Player'

export class Player extends GeneratedPlayer {
  declare status: PlayerStatus
}

export { GameStatus, PlayerStatus }
