import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Board } from '@/lib/game/board'
import { Level } from '@/lib/game/logic'
import Screen from '@/pages/practice/components/Screen'
import { LayoutGrid } from 'lucide-react'
import { GameStatus, Player, PlayerStatus } from '@/schema'
import { useEffect, useMemo, useState } from 'react'
import { formatDuration } from '@/lib/utils'
import { canCreateNewGame, canStartGame, QueenRoomState } from '@/schema/queen'
import { Badge } from '@/components/ui/badge'

interface GameBoardProps {
  state: QueenRoomState
  onNewGame: () => void
  onReady: () => void
  onStart: () => void
  onFinish: (board: Board) => void
  currentPlayer?: Player
}

export default function GameBoard({ state, onNewGame, onReady, onStart, onFinish, currentPlayer }: GameBoardProps) {
  const [remainingTime, setRemainingTime] = useState(0)
  const isCurrentPlayerReady = useMemo(() => {
    return !!currentPlayer && currentPlayer.status >= PlayerStatus.READY
  }, [currentPlayer?.status])

  useEffect(() => {
    setRemainingTime(state.gameStartedAt - Date.now())
    const timer = setInterval(() => {
      const remainingTime = state.gameStartedAt - Date.now()
      if (remainingTime <= 0) {
        clearInterval(timer)
      }
      setRemainingTime(remainingTime)
    }, 1000)
    return () => clearInterval(timer)
  }, [state.gameStartedAt])

  const level = useMemo(() => {
    return JSON.parse(state.test || '{}') as Level
  }, [state.test])

  const renderLeaderboard = () => {
    const leaderboard = state.leaderboard

    return (
      <div className='flex flex-col items-center gap-4 justify-center p-4'>
        <div className='w-full min-w-64 text-sm'>
          {leaderboard.map((player, index) => (
            <div
              key={player.id}
              className='flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors'
            >
              {player.status === PlayerStatus.SUBMITTED && (
                <>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground w-4'>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className='text-xs'>{player.name}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs text-green-600 border-blue-500/20'>
                        {formatDuration(player.durationInMs)}
                      </Badge>
                      {player.eloRating && (
                        <Badge variant='outline' className='text-xs border-yellow-500/20'>
                          {player.eloRating}
                          {player.eloChange !== 0 && (
                            <span className={player.eloChange > 0 ? 'text-green-600' : 'text-red-600'}>
                              {player.eloChange > 0 ? ' +' : ' '}
                              {player.eloChange}
                            </span>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}
              {player.status === PlayerStatus.DID_NOT_FINISH && (
                <>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground w-4'>~</span>
                    <span className='text-xs'>{player.name}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs text-red-600 border-red-500/20'>
                        DNF
                      </Badge>
                      {player.eloRating && (
                        <Badge variant='outline' className='text-xs border-yellow-500/20'>
                          {player.eloRating}
                          {player.eloChange !== 0 && (
                            <span className={player.eloChange > 0 ? 'text-green-600' : 'text-red-600'}>
                              {player.eloChange > 0 ? ' +' : ' '}
                              {player.eloChange}
                            </span>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderLobbyState = (waitingForNewGame: boolean) => (
    <div className='flex flex-col items-center min-h-64 justify-center'>
      {state.leaderboard.length > 0 && renderLeaderboard()}
      <Button onClick={onNewGame} disabled={waitingForNewGame || !canCreateNewGame(state)}>
        New Game
      </Button>
    </div>
  )

  const renderWaitingState = (isCurrentPlayerReady: boolean) => {
    const readyCount = Array.from(state.players.values()).filter(
      (player) => player.status === PlayerStatus.READY,
    ).length

    const canStart = isCurrentPlayerReady && canStartGame(state)

    return (
      <div className='flex flex-col items-center gap-4 min-h-64 justify-center'>
        <p className='text-muted-foreground'>
          Ready players:{' '}
          <span className='font-mono'>
            {readyCount}/{state.players.size}
          </span>
        </p>
        <div className='flex gap-2'>
          <Button onClick={onReady} variant='outline' disabled={isCurrentPlayerReady}>
            I'm Ready
          </Button>
          <Button onClick={onStart} variant='outline' disabled={!canStart}>
            Start Game
          </Button>
        </div>
      </div>
    )
  }

  const renderCountdownState = (isCurrentPlayerReady: boolean) => {
    return (
      <div className='flex flex-col items-center gap-4 min-h-64 justify-center'>
        <p className='text-muted-foreground'>
          Game will start in <span className='font-mono'>{formatDuration(remainingTime)}</span>
        </p>
        {!isCurrentPlayerReady && (
          <div className='flex gap-2'>
            <Button onClick={onReady} variant='outline'>
              Join
            </Button>
            <Button onClick={onStart} variant='outline' disabled={true}>
              Start Game
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderPlayingState = () => (
    <div className='gap-1 bg-muted/20 rounded-lg'>
      <Screen
        level={level}
        onFinish={onFinish}
        gameStartedAt={state.gameStartedAt}
        gameFinishedAt={state.gameFinishedAt}
      />
    </div>
  )

  const isRoundStarted = state.status === GameStatus.COUNTDOWNING || state.status === GameStatus.PLAYING

  return (
    <Card className='p-0'>
      <CardHeader className='px-4 pt-4 gap-2'>
        <div className='flex items-center gap-2'>
          <LayoutGrid className='h-5 w-5' />
          <CardTitle className='p-0 text-sm'>Game Board</CardTitle>
        </div>
        <CardDescription className='text-xs p-0'>
          {state.status === GameStatus.LOBBY && 'Waiting to start a new game'}
          {state.status === GameStatus.WAITING && 'Waiting for players to be ready'}
          {state.status === GameStatus.PLAYING && 'Game in progress'}
          {state.status === GameStatus.FINISHED && 'Game finished'}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0 pb-4'>
        {state.status === GameStatus.LOBBY && renderLobbyState(false)}
        {state.status === GameStatus.WAITING && renderWaitingState(isCurrentPlayerReady)}
        {isCurrentPlayerReady && (
          <>
            {state.status === GameStatus.COUNTDOWNING && renderCountdownState(true)}
            {state.status === GameStatus.PLAYING && renderPlayingState()}
          </>
        )}
        {!isCurrentPlayerReady && state.status === GameStatus.COUNTDOWNING && renderCountdownState(false)}
        {!isCurrentPlayerReady && state.status === GameStatus.PLAYING && (
          <div className='text-center h-32 flex items-center justify-center'>
            You are not ready. Please wait for next round :|
          </div>
        )}
        {state.status === GameStatus.FINISHED && renderLobbyState(true)}
      </CardContent>
    </Card>
  )
}
