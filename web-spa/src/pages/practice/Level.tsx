import { getLevelById, getRandomLevel } from '@/lib/api'
import { Level } from '@/lib/game/logic'
import { useEffect, useState } from 'react'
import Screen from './components/Screen'
import { useParams } from 'react-router-dom'

export default function LevelPage({}) {
  const { id } = useParams()
  const [level, setLevel] = useState<Level | null>(null)

  useEffect(() => {
    getLevelById(id!).then(setLevel)
  }, [])

  if (!level) {
    return <div>Loading...</div>
  }

  function handleRandomize() {
    getRandomLevel().then((level) => {
      if (level) {
        window.location.href = `/practice/${level.id}`
      }
    })
  }

  return (
    <div>
      <Screen level={level} onRandomize={handleRandomize} />
    </div>
  )
}
