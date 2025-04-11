import { getRandomLevel } from '@/lib/api'
import { Level } from '@/lib/game/logic'
import { useEffect, useState } from 'react'
import Screen from './components/Screen'

export default function Practice() {
  const [level, setLevel] = useState<Level | null>(null)

  useEffect(() => {
    getRandomLevel().then(setLevel)
  }, [])

  if (!level) {
    return <div>Loading...</div>
  }

  function handleRandomize() {
    getRandomLevel().then(setLevel)
  }

  return (
    <div>
      <Screen level={level} onRandomize={handleRandomize} />
    </div>
  )
}
