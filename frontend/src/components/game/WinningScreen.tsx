import React from 'react'
import Image from 'next/image'

import CloseIcon from '@/components/icons/CloseIcon'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/utils'
import goldCrown from '@/assets/gold-crown.svg'
import goldenChicletBg from '@/assets/golden-chiclet-bg.svg'

const WinningScreen = ({
  timer,
  close,
  onRefetch,
}: {
  timer: number
  close: () => void
  onRefetch?: () => Promise<void>
}) => {
  return (
    <div
      className={`bg-purple absolute flex w-72 flex-col items-center justify-center rounded-lg text-center text-xl text-white ${
        timer ? 'h-80' : 'h-72'
      } top-1/2 left-1/2 z-10 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 p-2 font-bold select-none`}
    >
      <button className="absolute top-3 right-3" onClick={close}>
        <CloseIcon />
      </button>
      <Image
        src={goldCrown}
        alt="Crown"
        className={`align-items-center ${timer ? 'mb-1' : 'mb-3'}`}
        width={`${timer ? '52' : '64'}`}
        height={`${timer ? '52' : '64'}`}
      />
      <div className={`${timer ? 'mb-3 text-xl' : 'mb-6 text-2xl'}`}>You Win!</div>

      <div className="flex flex-col space-y-3">
        {timer > 0 && (
          <div className="relative flex justify-center">
            <Image
              src={goldenChicletBg}
              alt="Golden chiclet background"
              className="h-16 w-full rounded object-cover"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-black">
              <div className="text-lg">{formatDuration(timer)}</div>
              <div className="text-sm font-medium">Solve Time</div>
            </div>
          </div>
        )}
        {onRefetch && (
          <Button onClick={onRefetch} className="mt-2 bg-white text-black hover:bg-gray-100">
            Try Another Level
          </Button>
        )}
      </div>
    </div>
  )
}

export default WinningScreen
