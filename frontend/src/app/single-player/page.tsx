'use client'

import { useEffect, useState } from 'react'

export default function SinglePlayerPage() {
  const [boardSize, setBoardSize] = useState(8)
  const [board, setBoard] = useState<number[][]>([])
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Initialize board
  useEffect(() => {
    generateNewBoard()
  }, [boardSize])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const generateNewBoard = () => {
    const newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(0))
    setBoard(newBoard)
    setTimer(0)
    setIsRunning(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleQueen = (row: number, col: number) => {
    const newBoard = [...board]
    newBoard[row][col] = newBoard[row][col] === 1 ? 0 : 1
    setBoard(newBoard)
  }

  const checkSolution = () => {
    // TODO: Implement solution checking logic
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Single Player Mode</h1>
          <div className="font-mono text-2xl">{formatTime(timer)}</div>
        </div>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Board Size:</label>
              <select
                value={boardSize}
                onChange={(e) => setBoardSize(Number(e.target.value))}
                className="rounded border px-2 py-1"
              >
                {[4, 5, 6, 7, 8].map((size) => (
                  <option key={size} value={size}>
                    {size}x{size}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateNewBoard}
              className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              New Game
            </button>
          </div>

          {/* Game Board */}
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              aspectRatio: '1/1',
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => toggleQueen(rowIndex, colIndex)}
                  className={`aspect-square border ${
                    (rowIndex + colIndex) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'
                  } ${cell === 1 ? 'bg-yellow-400' : ''} hover:bg-yellow-200`}
                />
              )),
            )}
          </div>
        </div>

        <button
          onClick={checkSolution}
          className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white hover:bg-green-700"
        >
          Check Solution
        </button>
      </div>
    </div>
  )
}
