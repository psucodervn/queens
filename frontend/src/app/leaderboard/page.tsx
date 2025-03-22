'use client';

import { useState } from 'react';

type LeaderboardEntry = {
    rank: number;
    username: string;
    points: number;
    fastestTime: string;
    gamesWon: number;
};

export default function LeaderboardPage() {
    const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

    // Mock data - replace with actual API call
    const leaderboardData: LeaderboardEntry[] = [
        { rank: 1, username: "Chessmaster", points: 2500, fastestTime: "1:30", gamesWon: 45 },
        { rank: 2, username: "QueenSlayer", points: 2300, fastestTime: "1:45", gamesWon: 42 },
        { rank: 3, username: "PuzzleKing", points: 2100, fastestTime: "2:00", gamesWon: 38 },
        { rank: 4, username: "BoardWizard", points: 1900, fastestTime: "2:15", gamesWon: 35 },
        { rank: 5, username: "StrategyPro", points: 1800, fastestTime: "2:20", gamesWon: 33 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
                    <div className="flex space-x-2">
                        {(['weekly', 'monthly', 'all-time'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-4 py-2 rounded-lg ${timeFilter === filter
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Player
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Points
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fastest Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Games Won
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaderboardData.map((entry) => (
                                <tr key={entry.rank} className={entry.rank <= 3 ? 'bg-yellow-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-lg font-semibold ${entry.rank === 1 ? 'text-yellow-600' :
                                                entry.rank === 2 ? 'text-gray-600' :
                                                    entry.rank === 3 ? 'text-orange-600' :
                                                        'text-gray-900'
                                            }`}>
                                            #{entry.rank}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {entry.username}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{entry.points}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{entry.fastestTime}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{entry.gamesWon}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 