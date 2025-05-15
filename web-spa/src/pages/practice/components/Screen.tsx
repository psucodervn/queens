import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Board } from '@/lib/game/board'
import { Level } from '@/lib/game/logic'
import { RefreshCw, Undo2, X } from 'lucide-react'
import { useEffect } from 'react'
import { gameStateReducer, useGameState } from '../state'
import GameBoard from './Board'
import SettingsDialog from './SettingsDialog'
import Timer from './Timer'
import { formatDuration } from '@/lib/utils'

function MissingRegionIndicator({ level, missingRegions }: { level: Level; missingRegions: Set<string> }) {
  const regionColors = level.regionColors

  return (
    <div className='flex items-center gap-2 ml-2'>
      {Array.from(missingRegions).map((regionCode) => (
        <div
          key={regionCode}
          className='w-5 h-5 border border-black'
          style={{ backgroundColor: regionColors[regionCode] }}
          title={`Region ${regionCode} needs a queen`}
        />
      ))}
    </div>
  )
}

interface ScreenProps {
  level: Level
  hasToolbar?: boolean
  onRandomize?: () => void
  onFinish?: (board: Board) => void
  gameStartedAt?: number
  gameFinishedAt?: number
}

const Screen = ({ level, hasToolbar = false, onRandomize, onFinish, gameStartedAt }: ScreenProps) => {
  const { state, dispatch } = useGameState(level, gameStartedAt)

  useEffect(() => {
    dispatch({ type: 'INITIALIZE', level, gameStartedAt })
  }, [level, dispatch, gameStartedAt])

  function handleSquareClick(row: number, col: number) {
    const nextState = gameStateReducer(state, { type: 'CLICK_SQUARE', row, col })
    dispatch({ type: 'SET_STATE', state: nextState })
    if (nextState.hasWon) {
      onFinish?.(nextState.board)
    }
  }

  const handleUndo = () => {
    if (!state.boardLocked) {
      dispatch({ type: 'UNDO' })
    }
  }

  const handleErase = () => {
    if (!state.boardLocked) {
      dispatch({ type: 'RESET_BOARD' })
    }
  }

  const handleToggleAutoMarkX = () => {
    dispatch({ type: 'TOGGLE_AUTO_MARK_X' })
  }

  const handleToggleShowClashingQueens = () => {
    dispatch({ type: 'TOGGLE_SHOW_CLASHING_QUEENS' })
  }

  return (
    <TooltipProvider>
      <div className='flex flex-col items-center justify-center select-none'>
        <div className='flex flex-col items-center'>
          <div>
            <div className={`flex w-full items-center space-x-4 py-4 sm:justify-between sm:space-x-0 mb-0'`}>
              <div className='flex flex-row items-center space-x-2 justify-between w-full'>
                <Timer startTime={state.startTime} stopped={false} />
                <div>
                  {state.hasWon && (
                    <div className='text-green-600 mx-2'>
                      Finished in <span className='font-mono'>{formatDuration(state.elapsedTime)}</span>
                    </div>
                  )}
                  <MissingRegionIndicator level={level} missingRegions={state.missingRegions} />
                </div>
              </div>

              {hasToolbar && (
                <div className='flex flex-1 justify-end sm:flex-none'>
                  <div className='relative flex items-center'>
                    {onRandomize && (
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
                    )}

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
              )}
            </div>

            <div className='game relative'>
              <GameBoard
                board={state.board}
                onSquareClick={handleSquareClick}
                showClashingQueens={state.showClashingQueens}
                boardLocked={state.boardLocked}
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
                      disabled={state.history.length <= 1 || state.boardLocked}
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
                      disabled={state.boardLocked}
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

            {onRandomize && (
              <div className='flex justify-center mt-4 w-full space-x-2'>
                <div className='w-full'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={onRandomize}
                        className='flex items-center gap-1 w-full'
                      >
                        <RefreshCw size={16} />
                        <span>New Game</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Game</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default Screen
