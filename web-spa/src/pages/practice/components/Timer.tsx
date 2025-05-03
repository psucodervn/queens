import { formatDuration } from '@/lib/utils'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

const ONE_HOUR_IN_SECONDS = 3600
const TEN_HOURS_IN_SECONDS = 36000

const Timer = ({ startTime, stopped, className = '' }: { startTime: number; stopped: boolean; className?: string }) => {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!stopped) {
        setSeconds(Math.floor((Date.now() - startTime) / 1000))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, stopped])

  return (
    <div className={`flex items-center space-x-1 font-medium font-mono ${className}`}>
      <Clock />
      <span
        className={`${seconds < ONE_HOUR_IN_SECONDS ? 'w-10' : seconds < TEN_HOURS_IN_SECONDS ? 'w-14' : 'w-full'}`}
      >
        {formatDuration(seconds, 'seconds')}
      </span>
    </div>
  )
}

export default Timer
