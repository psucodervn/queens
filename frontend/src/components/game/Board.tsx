import React, { useState } from 'react'

import { Board } from '@/lib/game/board'
import useGridSize from '@/hooks/useGridSize'
import Square from './Square'

const GameBoard = ({
  board,
  handleSquareClick,
  handleSquareMouseEnter,
  showClashingQueens,
  clashingQueens,
}: {
  board: Board
  handleSquareClick: (row: number, col: number) => void
  handleSquareMouseEnter: (squares: number[][]) => void
  showClashingQueens: boolean
  clashingQueens: Set<string>
}) => {
  const [initialSquare, setInitialSquare] = useState<string | undefined>(undefined)
  const [previousSquare, setPreviousSquare] = useState<string | undefined>(undefined)
  const [initialSquareHandled, setInitialSquareHandled] = useState(false)

  const { gridSize } = useGridSize(board.length)

  return (
    <div
      className="board border-1 border-black"
      style={{
        gridTemplateColumns: `repeat(${board.length}, ${gridSize})`,
        gridTemplateRows: `repeat(${board.length}, ${gridSize})`,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            value={square.value}
            color={square.color}
            onPointerDown={(e) => {
              const currentSquare = `${rowIndex},${colIndex}`
              setInitialSquare(currentSquare)
              setInitialSquareHandled(false)
              // otherwise the PointerUp event will have the row and col of the initial PointerDown event
              ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
            }}
            onPointerEnter={(e) => {
              const currentSquare = `${rowIndex},${colIndex}`
              // on mobile PointerEnter is fired once before PointerDown so check if there is already an initial square
              if (e.buttons === 1 && initialSquare) {
                const squares = [[rowIndex, colIndex]]
                // on desktop the initial drag cell stays empty (because click is triggered on pointer up)
                // since board state apparently can't be updated multiple times from a single event
                // we have to pass two coords (initial and current) to the handler
                if (!initialSquareHandled) {
                  squares.push(initialSquare.split(',').map(Number))
                  setInitialSquareHandled(true)
                }

                handleSquareMouseEnter(squares)
                setPreviousSquare(currentSquare)
              }
            }}
            onPointerUp={() => {
              const currentSquare = `${rowIndex},${colIndex}`
              const isBasicClick = initialSquare === currentSquare && !previousSquare
              // only do something if it was a regular click (and not the end of the drag)
              if (isBasicClick) {
                handleSquareClick(rowIndex, colIndex)
              }
              setPreviousSquare(undefined)
              setInitialSquare(undefined)
              setInitialSquareHandled(false)
            }}
            isClashing={showClashingQueens && clashingQueens.has(`${rowIndex},${colIndex}`)}
            data-row={rowIndex} // Add data attributes for touch handling
            data-col={colIndex}
          />
        )),
      )}
    </div>
  )
}

export default GameBoard
