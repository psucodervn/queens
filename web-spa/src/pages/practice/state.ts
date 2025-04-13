import { Board, createEmptyBoard, placeQueen, removeQueen } from '@/lib/game/board'
import { checkWinCondition, Level } from '@/lib/game/logic'
import { useReducer } from 'react'

export type GameState = {
  board: Board
  level: Level
  startTime: number
  hasWon: boolean
  elapsedTime: number
  autoMarkX: boolean
}

export type GameStateAction =
  | {
      type: 'SET_BOARD'
      board: Board
    }
  | {
      type: 'INITIALIZE'
      level: Level
    }
  | {
      type: 'RESET_BOARD'
    }
  | {
      type: 'CLICK_SQUARE'
      row: number
      col: number
    }
  | {
      type: 'TOGGLE_AUTO_MARK_X'
    }

function createInitialGameState(level: Level): GameState {
  const board = createEmptyBoard(level.colorRegions, level.regionColors)

  return {
    board,
    startTime: Date.now(),
    level,
    hasWon: false,
    elapsedTime: 0,
    autoMarkX: true,
  }
}

function gameStateReducer(state: GameState, action: GameStateAction): GameState {
  switch (action.type) {
    case 'INITIALIZE':
      return createInitialGameState(action.level)
    case 'SET_BOARD':
      return { ...state, board: action.board }
    case 'RESET_BOARD':
      return { ...state, board: createEmptyBoard(state.level.colorRegions, state.level.regionColors) }
    case 'CLICK_SQUARE':
      return handleSquareClick(state, action.row, action.col)
    case 'TOGGLE_AUTO_MARK_X':
      return { ...state, autoMarkX: !state.autoMarkX }
    default:
      return state
  }
}

function handleSquareClick(state: GameState, row: number, col: number) {
  const newBoard = structuredClone(state.board)
  const currentValue = newBoard[row][col].value

  if (currentValue === ' ') {
    newBoard[row][col].value = 'X'
  } else if (currentValue === 'X') {
    placeQueen(newBoard, row, col, state.autoMarkX)
  } else if (currentValue === 'Q') {
    removeQueen(newBoard, row, col)
  }

  if (checkWinCondition(newBoard)) {
    return { ...state, board: newBoard, hasWon: true, elapsedTime: Date.now() - state.startTime }
  }

  return { ...state, board: newBoard }
}

export const useGameState = (level: Level) => {
  const [state, dispatch] = useReducer(gameStateReducer, level, createInitialGameState)

  return { state, dispatch }
}
