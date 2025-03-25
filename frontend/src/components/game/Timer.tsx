import React from 'react'

import ClockIcon from '@/components/icons/ClockIcon'
import { formatDuration } from '@/lib/utils'

const ONE_HOUR_IN_SECONDS = 3600
const TEN_HOURS_IN_SECONDS = 36000

const Timer = ({ seconds, className = '' }: { seconds: number; className?: string }) => {
  return (
    <div className={`flex items-center space-x-1 font-medium ${className}`}>
      <ClockIcon />
      <span
        className={`${
          seconds < ONE_HOUR_IN_SECONDS
            ? 'w-10'
            : seconds < TEN_HOURS_IN_SECONDS
              ? 'w-14'
              : 'w-full'
        }`}
      >
        {formatDuration(seconds)}
      </span>
    </div>
  )
}

export default Timer
