import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Level } from '@/lib/game/logic'
import Screen from '@/pages/practice/components/Screen'
import { LayoutGrid } from 'lucide-react'

interface Player {
  id: string
  name: string
  isHost?: boolean
  connected?: boolean
  ready?: boolean
}

interface GameBoardProps {
  players: Player[]
  gameStatus: number
  level: Level
  onNewGame: () => void
  onReady: () => void
}

export default function GameBoard({ players, gameStatus, level, onNewGame, onReady }: GameBoardProps) {
  const renderLobbyState = () => (
    <div className='flex justify-center items-center h-64'>
      <Button onClick={onNewGame} disabled={players.length < 2} size='lg'>
        Start New Game
      </Button>
    </div>
  )

  const renderWaitingState = () => (
    <div className='flex flex-col items-center gap-4 h-64'>
      <p className='text-muted-foreground'>Waiting for players to be ready...</p>
      <Button onClick={onReady} variant='outline'>
        I'm Ready
      </Button>
    </div>
  )

  const renderPlayingState = () => (
    <div className='gap-1 p-4 bg-muted/20 rounded-lg'>
      <Screen level={level} onRandomize={() => {}} />
    </div>
  )

  return (
    <Card>
      <CardHeader className='py-3'>
        <div className='flex items-center gap-2'>
          <LayoutGrid className='h-5 w-5' />
          <CardTitle className='text-lg'>Game Board</CardTitle>
        </div>
        <CardDescription className='text-xs'>
          {gameStatus === 0 && 'Waiting to start a new game'}
          {gameStatus === 1 && 'Waiting for players to be ready'}
          {gameStatus === 2 && 'Game in progress'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gameStatus === 0 && renderLobbyState()}
        {gameStatus === 1 && renderWaitingState()}
        {gameStatus === 2 && renderPlayingState()}
      </CardContent>
    </Card>
  )
}
