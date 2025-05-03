import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Board } from '@/lib/game/board'
import { Level } from '@/lib/game/logic'
import Screen from '@/pages/practice/components/Screen'
import { Player } from '@/schema/Player'
import { QueenRoomState } from '@/schema/QueenRoomState'
import { LayoutGrid } from 'lucide-react'
import { GameStatus } from '@/schema/enums'
import { useMemo } from 'react'

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
      <Button onClick={onReady} variant='outline' disabled={currentPlayer?.status === 1}>
        I'm Ready
      </Button>
    </div>
  )

  const renderPlayingState = () => (
    <div className='gap-1 bg-muted/20 rounded-lg'>
      <Screen level={level} onFinish={onFinish} gameStartedAt={state.gameStartedAt} gameEndedAt={state.gameEndedAt} />
    </div>
  )

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
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        {state.status === GameStatus.LOBBY && renderLobbyState()}
        {state.status === GameStatus.WAITING && renderWaitingState()}
        {state.status === GameStatus.PLAYING && renderPlayingState()}
      </CardContent>
    </Card>
  )
}
