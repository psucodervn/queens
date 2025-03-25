import { Board, ColorRegions, RegionColors } from './board';

export type Position = { row: number; col: number };

export type Level = {
  size: number;
  colorRegions: ColorRegions;
  regionColors: RegionColors;
};

// Check if it's safe to place a queen
export const isSafeToPlaceQueen = (
  board: Board,
  row: number,
  col: number,
  size: number
): boolean => {
  // Check for same row and column
  for (let i = 0; i < size; i++) {
    if (board[row][i].value === 'Q' || board[i][col].value === 'Q') return false;
  }

  // Check adjacent diagonal squares
  const adjacentDiagonals: [number, number][] = [
    [row - 1, col - 1],
    [row - 1, col + 1],
    [row + 1, col - 1],
    [row + 1, col + 1],
  ];

  for (const [r, c] of adjacentDiagonals) {
    if (board[r]?.[c]?.value === 'Q') return false;
  }

  // Check for the same region
  const color = board[row][col].color;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c].color === color && board[r][c].value === 'Q') {
        return false;
      }
    }
  }

  return true;
};

// Check if all queens are placed correctly
export const checkWinCondition = (board: Board): boolean => {
  const size = board.length;
  const queensPerRow = Array(size).fill(0);
  const queensPerCol = Array(size).fill(0);
  const queensPerRegion: Record<string, number> = {};

  // To track if queens are placed diagonally next to each other
  const mainDiagonal: Record<string, number[]> = {};
  const antiDiagonal: Record<string, number[]> = {};

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].value === 'Q') {
        // Increment row and column queen counts
        queensPerRow[row]++;
        queensPerCol[col]++;

        // Increment region queen count
        const region = board[row][col].color;
        if (!queensPerRegion[region]) {
          queensPerRegion[region] = 0;
        }
        queensPerRegion[region]++;

        // Check if queens are touching diagonally on the main diagonal
        const mainDiagIndex = row - col;
        if (!mainDiagonal[mainDiagIndex]) {
          mainDiagonal[mainDiagIndex] = [];
        }
        mainDiagonal[mainDiagIndex].push(row);

        // Check if queens are touching diagonally on the anti-diagonal
        const antiDiagIndex = row + col;
        if (!antiDiagonal[antiDiagIndex]) {
          antiDiagonal[antiDiagIndex] = [];
        }
        antiDiagonal[antiDiagIndex].push(row);
      }
    }
  }

  // Check if there are exactly 1 queen per row, column, and region
  for (let i = 0; i < size; i++) {
    if (queensPerRow[i] !== 1 || queensPerCol[i] !== 1) {
      return false; // Fail condition if any row or column has more than 1 queen
    }
  }

  for (const region in queensPerRegion) {
    if (queensPerRegion[region] !== 1) {
      return false; // Fail condition if any region has more than 1 queen
    }
  }

  // Check for diagonal adjacency violations
  for (const diagIndex in mainDiagonal) {
    const rows = mainDiagonal[diagIndex];
    if (hasAdjacent(rows)) {
      return false; // Fail condition if queens are touching on the main diagonal
    }
  }

  for (const diagIndex in antiDiagonal) {
    const rows = antiDiagonal[diagIndex];
    if (hasAdjacent(rows)) {
      return false; // Fail condition if queens are touching on the anti-diagonal
    }
  }

  return true; // Pass condition if no violations are found
};

// Helper function to check if queens are placed adjacently in a diagonal
const hasAdjacent = (rowPositions: number[]): boolean => {
  rowPositions.sort((a, b) => a - b); // Sort the row positions
  for (let i = 0; i < rowPositions.length - 1; i++) {
    if (rowPositions[i + 1] - rowPositions[i] === 1) {
      return true; // If any two queens are adjacent in the diagonal, return true
    }
  }
  return false;
};

// Utility function to find clashing queens
export const getClashingQueens = (board: Board): Position[] => {
  const size = board.length;
  const clashes: Position[] = [];
  const queensPerRow = Array(size).fill(0);
  const queensPerCol = Array(size).fill(0);
  const queensPerRegion: Record<string, number> = {};
  const mainDiagonal: Record<string, Position[]> = {};
  const antiDiagonal: Record<string, Position[]> = {};

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].value === 'Q') {
        const region = board[row][col].color;

        // Track queens in rows, columns, and regions
        queensPerRow[row]++;
        queensPerCol[col]++;
        queensPerRegion[region] = (queensPerRegion[region] || 0) + 1;

        // Track diagonal queens
        const mainDiagIndex = row - col;
        mainDiagonal[mainDiagIndex] = (mainDiagonal[mainDiagIndex] || []).concat({ row, col });

        const antiDiagIndex = row + col;
        antiDiagonal[antiDiagIndex] = (antiDiagonal[antiDiagIndex] || []).concat({ row, col });
      }
    }
  }

  // Detect clashes in rows, columns, and regions
  for (let row = 0; row < size; row++) {
    if (queensPerRow[row] > 1) {
      for (let col = 0; col < size; col++) {
        if (board[row][col].value === 'Q') clashes.push({ row, col });
      }
    }
  }

  for (let col = 0; col < size; col++) {
    if (queensPerCol[col] > 1) {
      for (let row = 0; row < size; row++) {
        if (board[row][col].value === 'Q') clashes.push({ row, col });
      }
    }
  }

  Object.entries(queensPerRegion).forEach(([region, count]) => {
    if (count > 1) {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (board[row][col].color === region && board[row][col].value === 'Q')
            clashes.push({ row, col });
        }
      }
    }
  });

  // Detect diagonal adjacency clashes
  const checkDiagonalClashes = (diagonal: Record<string, Position[]>) => {
    Object.values(diagonal).forEach((positions) => {
      positions.forEach(({ row, col }, index) => {
        const next = positions[index + 1];
        if (next && Math.abs(row - next.row) === 1) {
          clashes.push({ row, col });
          clashes.push(next);
        }
      });
    });
  };

  checkDiagonalClashes(mainDiagonal);
  checkDiagonalClashes(antiDiagonal);

  return clashes;
};
