import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Level } from '@/lib/game/logic'
import { RefreshCw, Undo2, X } from 'lucide-react'
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

  function handleUndo() {
    dispatch({ type: 'UNDO' })
  }

  function handleToggleShowClashingQueens() {
    dispatch({ type: 'TOGGLE_SHOW_CLASHING_QUEENS' })
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
                    <TooltipContent>New Game</TooltipContent>
                  </Tooltip>

                  <SettingsDialog
                    showClashingQueens={state.showClashingQueens}
                    toggleShowClashingQueens={handleToggleShowClashingQueens}
                    autoPlaceXs={state.autoMarkX}
                    toggleAutoPlaceXs={handleToggleAutoMarkX}
                    showClock={true}
                    toggleShowClock={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className='game relative'>
              <GameBoard
                board={state.board}
                onSquareClick={handleSquareClick}
                showClashingQueens={state.showClashingQueens}
              />
            </div>

            <div className='flex justify-center mt-4 w-full space-x-2'>
              <div className='w-1/2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleUndo}
                      disabled={state.history.length <= 1}
                      className='flex items-center gap-1 w-full'
                    >
                      <Undo2 size={16} />
                      <span>Undo</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo Last Move</TooltipContent>
                </Tooltip>
              </div>

              <div className='w-1/2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleErase}
                      className='flex items-center gap-1 w-full'
                    >
                      <X size={16} />
                      <span>Clear</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Board</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default Screen
