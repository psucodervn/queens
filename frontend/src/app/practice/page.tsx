'use client'

import { useEffect, useState } from 'react'

import LevelBoard from '@/components/game/Level'
import { getRandomLevel } from '@/lib/api'
import { Level } from '@/lib/game/logic'

export default function Practice() {
  const [level, setLevel] = useState<Level | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchLevel = async () => {
    try {
      const randomLevel = await getRandomLevel()
      setLevel(randomLevel)
    } catch (err) {
      setError('Failed to load level. Please try again.')
      console.error('Error fetching level:', err)
    }
  }

  useEffect(() => {
    fetchLevel()
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!level) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p>Loading level...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <LevelBoard id="random" level={level} onRefetch={fetchLevel} />
    </div>
  )
}
