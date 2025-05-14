import useGridSize from '@/hooks/useGridSize'
import { Board } from '@/lib/game/board'
import { getClashingQueens } from '@/lib/game/logic'
import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'
import Cross from './Cross'
import Queen from './Queen'

interface BoardProps {
  board: Board
  onSquareClick: (row: number, col: number) => void
  showClashingQueens?: boolean
  boardLocked?: boolean
}

const GameBoard = ({ board, onSquareClick, showClashingQueens = false, boardLocked = false }: BoardProps) => {
  const boardSize = board.length
  const { gridSize } = useGridSize(boardSize)
  const [isDragging, setIsDragging] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  // Get clashing queens positions if the feature is enabled
  const clashingQueens = showClashingQueens ? getClashingQueens(board) : []

  function borderClasses(rowIndex: number, colIndex: number) {
    const borderClasses: string[] = []
    const currentColor = board[rowIndex][colIndex].color

    if (rowIndex > 0) {
      const aboveColor = board[rowIndex - 1][colIndex].color
      if (aboveColor !== currentColor) {
        borderClasses.push('border-t-2')
      }
    }

    if (colIndex > 0) {
      const leftColor = board[rowIndex][colIndex - 1].color
      if (leftColor !== currentColor) {
        borderClasses.push('border-l-2')
      }
    }

    return cn(...borderClasses)
  }

  const handlePointerDown = (row: number, col: number) => {
    // Do nothing if board is locked
    if (boardLocked) return

    const currentValue = board[row][col].value
    // Only start dragging if the square is empty
    if (currentValue === ' ') {
      setIsDragging(true)
      onSquareClick(row, col)
    } else {
      // For non-empty squares, just handle the click normally
      onSquareClick(row, col)
    }
  }

  const handlePointerEnter = (row: number, col: number) => {
    if (isDragging && board[row][col].value === ' ') {
      onSquareClick(row, col)
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // Check if a square is part of a clashing queen
  const isClashingQueen = (row: number, col: number) => {
    return clashingQueens.some((pos) => pos.row === row && pos.col === col)
  }

  return (
    <div
      ref={boardRef}
      className='grid touch-none user-select-none w-fit border-r-2 border-b-2 border-t border-l border-black'
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${gridSize})`,
        gridTemplateRows: `repeat(${boardSize}, ${gridSize})`,
      }}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              'box-border flex h-full items-center justify-center text-[24px] border-t border-l border-black',
              borderClasses(rowIndex, colIndex),
              isClashingQueen(rowIndex, colIndex) && 'text-red-500',
              !boardLocked && 'hover:brightness-75 cursor-pointer',
              boardLocked && 'opacity-70 cursor-not-allowed',
            )}
            onPointerDown={() => handlePointerDown(rowIndex, colIndex)}
            onPointerEnter={() => handlePointerEnter(rowIndex, colIndex)}
            style={{
              backgroundColor: square.color,
            }}
            draggable='false'
          >
            {square.value === 'Q' ? <Queen /> : square.value === 'X' ? <Cross /> : square.value}
          </div>
        )),
      )}
    </div>
  )
}

export default GameBoard
