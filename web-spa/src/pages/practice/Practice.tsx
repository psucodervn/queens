import { getRandomLevel } from '@/lib/api'
import { Level } from '@/lib/game/logic'
import { useEffect, useState } from 'react'
import Screen from './components/Screen'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { RefreshCw } from 'lucide-react'

export default function Practice() {
  const enabled = true
  const [level, setLevel] = useState<Level | null>(null)

  useEffect(() => {
    getRandomLevel().then(setLevel)
  }, [])

  if (!enabled) {
    return <div>Currently disabled</div>
  }

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
