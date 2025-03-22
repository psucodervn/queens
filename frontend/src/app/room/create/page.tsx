'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRoomPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        boardSize: '8',
        maxPlayers: '4',
        rounds: '3',
        timeLimit: '300', // 5 minutes in seconds
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement room creation logic
        try {
            // Placeholder for API call
            const roomId = 'test-room-123'; // This should come from the API
            router.push(`/room/${roomId}`);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Room</h1>

                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="boardSize" className="block text-sm font-medium text-gray-700">
                                Board Size
                            </label>
                            <select
                                id="boardSize"
                                name="boardSize"
                                value={formData.boardSize}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                                {[4, 5, 6, 7, 8].map(size => (
                                    <option key={size} value={size}>{size}x{size}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700">
                                Maximum Players
                            </label>
                            <select
                                id="maxPlayers"
                                name="maxPlayers"
                                value={formData.maxPlayers}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                                {[2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num} Players</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="rounds" className="block text-sm font-medium text-gray-700">
                                Number of Rounds
                            </label>
                            <select
                                id="rounds"
                                name="rounds"
                                value={formData.rounds}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Round{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
                                Time Limit (seconds)
                            </label>
                            <input
                                type="number"
                                name="timeLimit"
                                id="timeLimit"
                                min="60"
                                max="600"
                                value={formData.timeLimit}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Time limit per round (60-600 seconds)
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Room
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 