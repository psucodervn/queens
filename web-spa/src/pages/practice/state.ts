import { Board, createEmptyBoard, placeQueen, removeQueen } from '@/lib/game/board'
import { checkWinCondition, Level } from '@/lib/game/logic'
import { useReducer } from 'react'

// Extracted to be reusable across the app
export function findMissingRegions(board: Board, colorRegions: string[][]) {
  const regionQueens = new Map<string, boolean>()

  // Check which regions have queens
  board.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      if (square.value === 'Q') {
        const regionCode = colorRegions[rowIndex][colIndex]
        regionQueens.set(regionCode, true)
      }
    })
  })

  // Find regions without queens
  const missingRegions = new Set<string>()
  colorRegions.forEach((row) => {
    row.forEach((regionCode) => {
      if (!regionQueens.get(regionCode)) {
        missingRegions.add(regionCode)
      }
    })
  })

  return missingRegions
}

export type GameState = {
  board: Board
  level: Level
  startTime: number
  hasWon: boolean
  elapsedTime: number
  autoMarkX: boolean
  showClashingQueens: boolean
  history: Board[]
  missingRegions: Set<string>
  boardLocked: boolean
}

export type GameStateAction =
  | {
      type: 'SET_BOARD'
      board: Board
    }
  | {
      type: 'INITIALIZE'
      level: Level
      gameStartedAt?: number
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
  | {
      type: 'SET_STATE'
      state: GameState
    }
  | {
      type: 'LOCK_BOARD'
    }

function createInitialGameState({ level, gameStartedAt }: { level: Level; gameStartedAt?: number }): GameState {
  let board = createEmptyBoard(level.colorRegions, level.regionColors)

  if (level.id) {
    const data = localStorage.getItem(`board:${level.id}`)
    if (data) {
      try {
        board = JSON.parse(data)
      } catch (error) {
        console.warn('Error parsing board data from localStorage', error)
      }
    }
  }

  return {
    board,
    startTime: gameStartedAt || Date.now(),
    level,
    hasWon: false,
    elapsedTime: 0,
    autoMarkX: false,
    showClashingQueens: true,
    history: [structuredClone(board)],
    missingRegions: findMissingRegions(board, level.colorRegions),
    boardLocked: false,
  }
}

export function gameStateReducer(state: GameState, action: GameStateAction): GameState {
  let emptyBoard: Board
  let newHistory: Board[]
  let previousBoard: Board

  let nextState: GameState
  switch (action.type) {
    case 'LOCK_BOARD':
      return { ...state, boardLocked: true }
    case 'SET_STATE':
      nextState = action.state
      break
    case 'INITIALIZE':
      nextState = createInitialGameState({ level: action.level, gameStartedAt: action.gameStartedAt })
      break
    case 'SET_BOARD':
      nextState = { ...state, board: action.board }
      break
    case 'RESET_BOARD':
      emptyBoard = createEmptyBoard(state.level.colorRegions, state.level.regionColors)
      nextState = {
        ...state,
        hasWon: false,
        board: emptyBoard,
        history: [structuredClone(emptyBoard)],
        missingRegions: findMissingRegions(emptyBoard, state.level.colorRegions),
      }
      break
    case 'CLICK_SQUARE':
      nextState = handleSquareClick(state, action.row, action.col)
      nextState.missingRegions = findMissingRegions(nextState.board, state.level.colorRegions)
      break
    case 'TOGGLE_AUTO_MARK_X':
      nextState = { ...state, autoMarkX: !state.autoMarkX }
      break
    case 'TOGGLE_SHOW_CLASHING_QUEENS':
      nextState = { ...state, showClashingQueens: !state.showClashingQueens }
      break
    case 'UNDO':
      if (state.history.length <= 1) return state
      newHistory = [...state.history]
      newHistory.pop() // Remove current state
      previousBoard = newHistory[newHistory.length - 1]
      nextState = {
        ...state,
        board: structuredClone(previousBoard),
        history: newHistory,
        missingRegions: findMissingRegions(previousBoard, state.level.colorRegions),
      }
      break
    default:
      nextState = state
  }

  localStorage.setItem(`board:${state.level.id}`, JSON.stringify(nextState.board))
  return nextState
}

function handleSquareClick(state: GameState, row: number, col: number) {
  // If board is locked, do nothing
  if (state.boardLocked) return state

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
      boardLocked: true,
    }
  }

  return { ...state, hasWon: false, board: newBoard, history: newHistory }
}

export const useGameState = (level: Level, gameStartedAt?: number) => {
  const [state, dispatch] = useReducer(gameStateReducer, { level, gameStartedAt }, createInitialGameState)

  return { state, dispatch }
}
