import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Board } from '@/lib/game/board'
import { Level } from '@/lib/game/logic'
import Screen from '@/pages/practice/components/Screen'
import { LayoutGrid } from 'lucide-react'
import { GameStatus, Player, PlayerStatus, QueenRoomState } from '@/schema'
import { useMemo } from 'react'
import { formatDuration } from '@/lib/utils'

interface GameBoardProps {
  state: QueenRoomState
  onNewGame: () => void
  onReady: () => void
  onFinish: (board: Board) => void
  currentPlayer?: Player
}

export default function GameBoard({ state, onNewGame, onReady, onFinish, currentPlayer }: GameBoardProps) {
  const level = useMemo(() => {
    return JSON.parse(state.test || '{}') as Level
  }, [state.test])

  const renderLobbyState = () => (
    <div className='flex justify-center items-center h-64'>
      <Button onClick={onNewGame} disabled={state.players.size < 2} size='lg'>
        Start New Game
      </Button>
    </div>
  )

  const renderWaitingState = () => (
    <div className='flex flex-col items-center gap-4 min-h-64 justify-center'>
      <p className='text-muted-foreground'>Waiting for players to be ready...</p>
      <Button onClick={onReady} variant='outline' disabled={currentPlayer?.status === PlayerStatus.READY}>
        I'm Ready
      </Button>
    </div>
  )

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

  const renderFinishedState = () => {
    // Sort players by submission time (lower is better)
    const leaderboard = state.leaderboard

    return (
      <div className='flex flex-col items-center gap-4 min-h-64 justify-center'>
        <div className='w-full max-w-md'>
          <h3 className='text-lg font-semibold mb-2'>Leaderboard</h3>
          <div className='space-y-2'>
            {leaderboard.map((player, index) => (
              <div key={player.id} className='flex items-center justify-between p-2 rounded-lg bg-muted/20 gap-4'>
                {player.status === PlayerStatus.SUBMITTED && (
                  <>
                    <span className='text-muted-foreground'>#{index + 1}</span>
                    <div className='flex justify-between gap-2 w-full'>
                      <span className='font-medium'>{player.name}</span>
                      <span className='text-green-500'>{formatDuration(player.durationInMs)}</span>
                    </div>
                  </>
                )}
                {player.status === PlayerStatus.DID_NOT_FINISH && (
                  <>
                    <span className='text-muted-foreground'>~</span>
                    <div className='flex justify-between gap-2 w-full'>
                      <span className='font-medium'>{player.name}</span>
                      <span className='text-red-500'>DNF</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button onClick={onNewGame} size='lg'>
          New Game
        </Button>
      </div>
    )
  }

  return (
    <Card className='gap-0'>
      <CardHeader className='py-2 gap-2'>
        <div className='flex items-center gap-2'>
          <LayoutGrid className='h-5 w-5' />
          <CardTitle className='text'>Game Board</CardTitle>
        </div>
        <CardDescription className='text-xs p-0'>
          {state.status === GameStatus.LOBBY && 'Waiting to start a new game'}
          {state.status === GameStatus.WAITING && 'Waiting for players to be ready'}
          {state.status === GameStatus.PLAYING && 'Game in progress'}
          {state.status === GameStatus.FINISHED && 'Game finished'}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        {state.status === GameStatus.LOBBY && renderLobbyState()}
        {state.status === GameStatus.WAITING && renderWaitingState()}
        {state.status === GameStatus.PLAYING && renderPlayingState()}
        {state.status === GameStatus.FINISHED && renderFinishedState()}
      </CardContent>
    </Card>
  )
}
