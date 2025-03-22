'use client';

import Link from 'next/link';

export default function DashboardPage() {
    // Mock user data - replace with actual data from your backend
    const userStats = {
        points: 1200,
        fastestTime: '2:45',
        gamesPlayed: 15,
        winRate: '75%'
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                {/* User Stats */}
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Points</p>
                            <p className="text-2xl font-bold">{userStats.points}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Fastest Time</p>
                            <p className="text-2xl font-bold">{userStats.fastestTime}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Games Played</p>
                            <p className="text-2xl font-bold">{userStats.gamesPlayed}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Win Rate</p>
                            <p className="text-2xl font-bold">{userStats.winRate}</p>
                        </div>
                    </div>
                </div>

                {/* Game Modes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/single-player"
                        className="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-2">Single Player</h3>
                        <p className="text-gray-600">Practice solving N-Queens puzzles at your own pace</p>
                    </Link>

                    <Link href="/room/create"
                        className="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-2">Create Multiplayer Room</h3>
                        <p className="text-gray-600">Start a new multiplayer game and invite friends</p>
                    </Link>

                    <Link href="/leaderboard"
                        className="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
                        <p className="text-gray-600">See how you rank against other players</p>
                    </Link>
                </div>
            </div>
        </div>
    );
} 