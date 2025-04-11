export type ColorRegions = string[][]
export type RegionColors = Record<string, string>
export type BoardItemValue = ' ' | 'Q' | 'X'

export type BoardItem = {
  value: BoardItemValue
  color: string
}

export type Board = BoardItem[][]

// Helper function to create an empty board
export const createEmptyBoard = (colorRegions: ColorRegions, regionColors: RegionColors): Board => {
  return colorRegions.map((row) => row.map((color) => ({ value: ' ', color: regionColors[color] })))
}

export const createInitialBoardForBuilder = (size: number, fill: BoardItem): Board => {
  return Array(size)
    .fill(fill)
    .map(() => Array(size).fill(fill)) // Create an empty board based on the size parameter
}

export const getQueenPositionForGivenX = (xRow: number, xCol: number, newBoard: Board) => {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // Row and column
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // Diagonals
  ]

  // Check immediate row, column, and diagonal neighbors
  for (const [dRow, dCol] of directions) {
    const newRow = xRow + dRow
    const newCol = xCol + dCol
    if (
      newRow >= 0 &&
      newRow < newBoard.length &&
      newCol >= 0 &&
      newCol < newBoard[0].length &&
      newBoard[newRow][newCol].value === 'Q'
    ) {
      return { x: newRow, y: newCol } // Another queen requires this 'X' cell
    }
  }

  // Check full row and column for any queens
  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[xRow][i].value === 'Q') {
      return { x: xRow, y: i }
    }
    if (newBoard[i][xCol].value === 'Q') {
      return { x: i, y: xCol }
    }
  }

  // Check the color region for any queens
  const regionColor = newBoard[xRow][xCol].color
  for (let r = 0; r < newBoard.length; r++) {
    for (let c = 0; c < newBoard[0].length; c++) {
      if (
        newBoard[r][c].color === regionColor && // Same region
        newBoard[r][c].value === 'Q' // Queen present
      ) {
        return { x: r, y: c }
      }
    }
  }

  return null // No queens require this 'X' cell
}

export const placeQueen = (newBoard: Board, row: number, col: number) => {
  newBoard[row][col].value = 'Q' // Place the queen

  const newXs: number[][] = []
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // Row and column
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // Diagonals
  ]

  // Add X's around the queen
  directions.forEach(([dRow, dCol]) => {
    const xRow = row + dRow
    const xCol = col + dCol
    if (
      xRow >= 0 &&
      xRow < newBoard.length &&
      xCol >= 0 &&
      xCol < newBoard[0].length &&
      newBoard[xRow][xCol].value === ' '
    ) {
      newBoard[xRow][xCol].value = 'X'
      newXs.push([xRow, xCol])
    }
  })

  // Add X's in the row and column
  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[row][i].value === ' ') {
      newBoard[row][i].value = 'X'
      newXs.push([row, i])
    }
    if (newBoard[i][col].value === ' ') {
      newBoard[i][col].value = 'X'
      newXs.push([i, col])
    }
  }

  // Add X's in the same color region
  const queenRegion = newBoard[row][col].color
  for (let r = 0; r < newBoard.length; r++) {
    for (let c = 0; c < newBoard[0].length; c++) {
      if (
        newBoard[r][c].color === queenRegion && // Same region
        newBoard[r][c].value === ' ' // Empty square
      ) {
        newBoard[r][c].value = 'X'
        newXs.push([r, c])
      }
    }
  }
}

export const removeQueen = (newBoard: Board, row: number, col: number) => {
  newBoard[row][col].value = ' ' // Remove the queen
}
