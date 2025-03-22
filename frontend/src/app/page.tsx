'use client';

import Link from 'next/link';

export default function HomePage() {
  // Mock user data - replace with actual data from your backend
  const userStats = {
    points: 1200,
    fastestTime: '2:45',
    gamesPlayed: 15,
    winRate: '75%',
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* User Stats */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Your Stats</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Points</p>
              <p className="text-2xl font-bold">{userStats.points}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Fastest Time</p>
              <p className="text-2xl font-bold">{userStats.fastestTime}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Games Played</p>
              <p className="text-2xl font-bold">{userStats.gamesPlayed}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Win Rate</p>
              <p className="text-2xl font-bold">{userStats.winRate}</p>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/single-player"
            className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold">Single Player</h3>
            <p className="text-gray-600">Practice solving N-Queens puzzles at your own pace</p>
          </Link>

          <Link
            href="/room/create"
            className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold">Create Multiplayer Room</h3>
            <p className="text-gray-600">Start a new multiplayer game and invite friends</p>
          </Link>

          <Link
            href="/leaderboard"
            className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold">Leaderboard</h3>
            <p className="text-gray-600">See how you rank against other players</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
