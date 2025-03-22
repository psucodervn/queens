'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Player = {
  id: string;
  username: string;
  isReady: boolean;
  score: number;
};

export default function RoomPage() {
  const { roomId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [boardSize] = useState(8);
  const [board, setBoard] = useState<number[][]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [timer, setTimer] = useState(0);

  // Mock data - replace with actual websocket connection
  useEffect(() => {
    setPlayers([
      { id: '1', username: 'Player 1', isReady: true, score: 0 },
      { id: '2', username: 'Player 2', isReady: false, score: 0 },
    ]);
    generateNewBoard();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  const generateNewBoard = () => {
    const newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(0));
    setBoard(newBoard);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleQueen = (row: number, col: number) => {
    if (gameStatus !== 'playing') return;
    const newBoard = [...board];
    newBoard[row][col] = newBoard[row][col] === 1 ? 0 : 1;
    setBoard(newBoard);
  };

  const startGame = () => {
    setGameStatus('playing');
    setTimer(0);
  };

  const submitSolution = () => {
    // TODO: Implement solution validation and scoring
    setGameStatus('finished');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Room #{roomId}</h1>
          <div className="font-mono text-2xl">{formatTime(timer)}</div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Player List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Players</h2>
              <div className="space-y-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div>
                      <div className="font-medium">{player.username}</div>
                      <div className="text-sm text-gray-500">Score: {player.score}</div>
                    </div>
                    <div
                      className={`rounded px-2 py-1 text-sm ${
                        player.isReady ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {player.isReady ? 'Ready' : 'Not Ready'}
                    </div>
                  </div>
                ))}
              </div>

              {gameStatus === 'waiting' && (
                <button
                  onClick={startGame}
                  className="mt-4 w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Start Game
                </button>
              )}
            </div>
          </div>

          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <div
                className="mb-6 grid gap-1"
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
                      disabled={gameStatus !== 'playing'}
                      className={`aspect-square border ${
                        (rowIndex + colIndex) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'
                      } ${cell === 1 ? 'bg-yellow-400' : ''} ${
                        gameStatus === 'playing' ? 'hover:bg-yellow-200' : ''
                      }`}
                    />
                  ))
                )}
              </div>

              {gameStatus === 'playing' && (
                <button
                  onClick={submitSolution}
                  className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white hover:bg-green-700"
                >
                  Submit Solution
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
