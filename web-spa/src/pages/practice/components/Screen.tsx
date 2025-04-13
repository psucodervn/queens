import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Level } from '@/lib/game/logic'
import { Eraser, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { useGameState } from '../state'
import GameBoard from './Board'
import SettingsDialog from './SettingsDialog'
import Timer from './Timer'

interface ScreenProps {
  level: Level
  onRandomize: () => void
}

const Screen = ({ level, onRandomize }: ScreenProps) => {
  const { state, dispatch } = useGameState(level)

  useEffect(() => {
    dispatch({ type: 'INITIALIZE', level })
  }, [level, dispatch])

  function handleSquareClick(row: number, col: number) {
    dispatch({ type: 'CLICK_SQUARE', row, col })
  }

  function handleErase() {
    dispatch({ type: 'RESET_BOARD' })
  }

  function handleToggleAutoMarkX() {
    dispatch({ type: 'TOGGLE_AUTO_MARK_X' })
  }

  return (
    <TooltipProvider>
      <div className='flex flex-col items-center justify-center pt-4 select-none'>
        <div className='flex flex-col items-center'>
          <div>
            <div className={`flex w-full items-center space-x-4 py-4 sm:justify-between sm:space-x-0 mb-0'`}>
              <div className='flex items-center space-x-2'>
                <Timer startTime={state.startTime} stopped={state.hasWon} />
                {state.hasWon && <div className='text-green-500'>You won!</div>}
              </div>

              <div className='flex flex-1 justify-end sm:flex-none'>
                <div className='relative flex items-center'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={onRandomize}
                        className='mr-2 rounded-full border border-slate-500 p-2 cursor-pointer'
                      >
                        <RefreshCw size='18' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>New Level</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleErase}
                        className='mr-2 rounded-full border border-slate-500 p-2 cursor-pointer'
                      >
                        <Eraser size='18' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Clear Board</TooltipContent>
                  </Tooltip>

                  <SettingsDialog
                    showClashingQueens={true}
                    toggleShowClashingQueens={() => {}}
                    autoPlaceXs={state.autoMarkX}
                    toggleAutoPlaceXs={handleToggleAutoMarkX}
                    showClock={true}
                    toggleShowClock={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className='game relative'>
              <GameBoard board={state.board} onSquareClick={handleSquareClick} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default Screen
