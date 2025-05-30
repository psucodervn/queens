import { getRandomLevel } from '@/lib/api'
import { useEffect } from 'react'

export default function Practice() {
  useEffect(() => {
    // go to random level
    getRandomLevel().then((level) => {
      if (level) {
        window.location.href = `/practice/${level.id}`
      }
    })
  }, [])

  return null
}
