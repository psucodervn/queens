import { Message } from './chat'
import { GameStatus, PlayerStatus } from './enums'
import { QueenRoomState as GeneratedQueenRoomState } from './generated/QueenRoomState'

export const START_GAME_THRESHOLD_MS = 1000 * 10 // 10 seconds

export type QueenRoomState = Pick<
  GeneratedQueenRoomState,
  'players' | 'displayName' | 'gameStartedAt' | 'gameFinishedAt' | 'test' | 'leaderboard' | 'chats'
> & {
  status: GameStatus
  chats: Message[]
}

export function canCreateNewGame(state: QueenRoomState): boolean {
  if (![GameStatus.LOBBY, GameStatus.FINISHED].includes(state.status)) {
    return false
  }

  return state.players.size >= 1
}

export function canStartGame(state: QueenRoomState): boolean {
  if (![GameStatus.WAITING].includes(state.status)) {
    return false
  }

  const readyCount = Array.from(state.players.values()).filter((player) => player.status === PlayerStatus.READY).length

  return readyCount >= 2
}
