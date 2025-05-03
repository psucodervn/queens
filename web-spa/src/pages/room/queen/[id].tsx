import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { client } from '@/lib/colyseus'
import { Board } from '@/lib/game/board'
import { Player } from '@/schema/Player'
import { Room } from 'colyseus.js'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GameBoard from './GameBoard'
import RoomDetail from './RoomDetail'
import { useAuth } from '@/hooks/useAuth'
import { QueenRoomState } from '@/schema/QueenRoomState'

interface RoomStateAll {
  roomId: string
  clients?: Array<{
    id: string
    sessionId: string
  }>
  maxClients?: number
  state: QueenRoomState
}

interface ColyseusRoom extends Room {
  id: string
  clients: Array<{
    id: string
    sessionId: string
  }>
  maxClients: number
  state: QueenRoomState
}

export default function QueenRoomDetailPage() {
  const GAME_TYPE = 'queen'

  const { user } = useAuth()
  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(undefined)
  const { id } = useParams()
  const [room, setRoom] = useState<RoomStateAll | null>(null)
  const [, setConnectionStatus] = useState<string>('Connecting...')
  const [error, setError] = useState<string | null>(null)
  const [colyseusRoom, setColyseusRoom] = useState<ColyseusRoom | null>(null)

  let req: Promise<ColyseusRoom | undefined> = Promise.resolve(undefined)

  useEffect(() => {
    async function joinRoom() {
      if (!id) {
        setError('Room ID is required')
        return
      }

      const colyseusRoom = (await client.joinById(id)) as ColyseusRoom
      setColyseusRoom(colyseusRoom)

      try {
        setRoom({
          roomId: colyseusRoom.roomId,
          clients: colyseusRoom.clients,
          maxClients: colyseusRoom.maxClients,
          state: colyseusRoom.state,
        })
        setConnectionStatus('Connected')

        colyseusRoom.onStateChange((state: QueenRoomState) => {
          console.log('Room state changed:', state)
          setRoom((prev) => (prev ? { ...prev, state } : null))
          setCurrentPlayer(Array.from(state.players.values()).find((p) => p.id === user?.id))
        })

        colyseusRoom.onError((code, message) => {
          console.error('Room error:', { code, message })
          setError(message || 'An error occurred')
        })

        colyseusRoom.onLeave(() => {
          setConnectionStatus('Disconnected')
        })
      } catch (error) {
        console.error('Failed to join room:', error)
        setError('Failed to join room')
        setConnectionStatus('Connection failed')
      }

      return colyseusRoom
    }

    req = req.then(joinRoom)

    req.then(async (room) => {
      console.log('Joined room:', room)
    })

    return () => {
      req.then(async (room) => {
        await room?.leave()
        console.log('Leaving room:', room)
      })
    }
  }, [id])

  const handleNewGame = async () => {
    if (!colyseusRoom) return
    try {
      colyseusRoom.send('new-game')
    } catch (error) {
      console.error('Failed to start new game:', error)
      setError('Failed to start new game')
    }
  }

  const handleReady = async () => {
    if (!colyseusRoom) return
    try {
      colyseusRoom.send('ready', true)
    } catch (error) {
      console.error('Failed to set ready status:', error)
      setError('Failed to set ready status')
    }
  }

  const handleFinish = async (board: Board) => {
    console.log('handleFinish', board)
    if (!colyseusRoom) return

    try {
      colyseusRoom.send('submit', JSON.stringify(board))
    } catch (error) {
      console.error('Failed to submit board:', error)
      setError('Failed to submit board')
    }
  }

  if (error) {
    return (
      <div className='container mx-auto py-8'>
        <Card className='max-w-md mx-auto'>
          <CardHeader>
            <CardTitle className='text-destructive'>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant='outline'>
              <Link to='/lobby'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Lobby
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <Button asChild variant='outline' size='sm'>
            <Link to='/lobby'>
              <ArrowLeft className='mr-1 h-3 w-3' />
              Back to Lobby
            </Link>
          </Button>
          <h1 className='text-xl font-bold'>
            {room?.state?.displayName}
            <Badge variant='secondary' className='text-xs'>
              {GAME_TYPE.toUpperCase()}
            </Badge>
          </h1>
        </div>
      </div>

      {room?.state.displayName && (
        <div className='flex flex-col gap-4 md:grid md:grid-cols-3'>
          <div className='md:col-span-2'>
            <GameBoard
              state={room.state}
              onNewGame={handleNewGame}
              onReady={handleReady}
              onFinish={handleFinish}
              currentPlayer={currentPlayer}
            />
          </div>
          <div className='md:col-span-1'>
            <RoomDetail state={room.state} />
          </div>
        </div>
      )}
    </div>
  )
}
