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
  showClashingQueens: boolean
  history: Board[]
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
  | {
      type: 'TOGGLE_SHOW_CLASHING_QUEENS'
    }
  | {
      type: 'UNDO'
    }

function createInitialGameState(level: Level): GameState {
  const board = createEmptyBoard(level.colorRegions, level.regionColors)

  return {
    board,
    startTime: Date.now(),
    level,
    hasWon: false,
    elapsedTime: 0,
    autoMarkX: false,
    showClashingQueens: true,
    history: [structuredClone(board)],
  }
}

function gameStateReducer(state: GameState, action: GameStateAction): GameState {
  let emptyBoard: Board
  let newHistory: Board[]
  let previousBoard: Board

  switch (action.type) {
    case 'INITIALIZE':
      return createInitialGameState(action.level)
    case 'SET_BOARD':
      return { ...state, board: action.board }
    case 'RESET_BOARD':
      emptyBoard = createEmptyBoard(state.level.colorRegions, state.level.regionColors)
      return {
        ...state,
        hasWon: false,
        board: emptyBoard,
        history: [structuredClone(emptyBoard)],
      }
    case 'CLICK_SQUARE':
      return handleSquareClick(state, action.row, action.col)
    case 'TOGGLE_AUTO_MARK_X':
      return { ...state, autoMarkX: !state.autoMarkX }
    case 'TOGGLE_SHOW_CLASHING_QUEENS':
      return { ...state, showClashingQueens: !state.showClashingQueens }
    case 'UNDO':
      if (state.history.length <= 1) return state
      newHistory = [...state.history]
      newHistory.pop() // Remove current state
      previousBoard = newHistory[newHistory.length - 1]
      return {
        ...state,
        board: structuredClone(previousBoard),
        history: newHistory,
      }
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

  // Save the current state to history before applying changes
  const newHistory = [...state.history, structuredClone(newBoard)]

  if (checkWinCondition(newBoard)) {
    return {
      ...state,
      board: newBoard,
      hasWon: true,
      elapsedTime: Date.now() - state.startTime,
      history: newHistory,
    }
  }

  return { ...state, hasWon: false, board: newBoard, history: newHistory }
}

export const useGameState = (level: Level) => {
  const [state, dispatch] = useReducer(gameStateReducer, level, createInitialGameState)

  return { state, dispatch }
}
