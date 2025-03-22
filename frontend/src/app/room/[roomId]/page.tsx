'use client';

import { useState, useEffect } from 'react';
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
    const [boardSize, setBoardSize] = useState(8);
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
        const newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
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
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Room #{roomId}</h1>
                    <div className="text-2xl font-mono">{formatTime(timer)}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Player List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Players</h2>
                            <div className="space-y-4">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium">{player.username}</div>
                                            <div className="text-sm text-gray-500">Score: {player.score}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-sm ${player.isReady ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {player.isReady ? 'Ready' : 'Not Ready'}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {gameStatus === 'waiting' && (
                                <button
                                    onClick={startGame}
                                    className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                >
                                    Start Game
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Game Board */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="grid gap-1 mb-6"
                                style={{
                                    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                                    aspectRatio: '1/1'
                                }}>
                                {board.map((row, rowIndex) =>
                                    row.map((cell, colIndex) => (
                                        <button
                                            key={`${rowIndex}-${colIndex}`}
                                            onClick={() => toggleQueen(rowIndex, colIndex)}
                                            disabled={gameStatus !== 'playing'}
                                            className={`aspect-square border ${(rowIndex + colIndex) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'
                                                } ${cell === 1 ? 'bg-yellow-400' : ''} ${gameStatus === 'playing' ? 'hover:bg-yellow-200' : ''
                                                }`}
                                        />
                                    ))
                                )}
                            </div>

                            {gameStatus === 'playing' && (
                                <button
                                    onClick={submitSolution}
                                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
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