import useGridSize from '@/hooks/useGridSize'
import { Board } from '@/lib/game/board'
import { cn } from '@/lib/utils'
import Cross from './Cross'
import Queen from './Queen'

interface BoardProps {
  board: Board
  onSquareClick: (row: number, col: number) => void
}

const GameBoard = ({ board, onSquareClick }: BoardProps) => {
  const boardSize = board.length
  const { gridSize } = useGridSize(boardSize)

  function borderClasses(rowIndex: number, colIndex: number) {
    return cn(
      rowIndex > 0 && board[rowIndex - 1][colIndex].color !== board[rowIndex][colIndex].color && 'border-t-2',
      colIndex > 0 && board[rowIndex][colIndex - 1].color !== board[rowIndex][colIndex].color && 'border-l-2',
    )
  }

  return (
    <div
      className='grid touch-none user-select-none w-fit border-2 border-black'
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${gridSize})`,
        gridTemplateRows: `repeat(${boardSize}, ${gridSize})`,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              'hover:brightness-75 box-border flex h-full items-center justify-center cursor-pointer text-[24px] border-t border-l border-black',
              borderClasses(rowIndex, colIndex),
            )}
            onPointerDown={() => onSquareClick(rowIndex, colIndex)}
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
