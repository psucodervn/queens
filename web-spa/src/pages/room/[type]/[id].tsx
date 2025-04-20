import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { client } from '@/lib/colyseus'
import { Room } from 'colyseus.js'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GameBoard from './GameBoard'
import RoomDetail from './RoomDetail'

interface RoomMetadata {
  displayName: string
  players: Map<string, PlayerData>
  status: number
  test: string
}

interface PlayerData {
  name?: string
  isHost?: boolean
  connected?: boolean
  ready?: boolean
  [key: string]: unknown
}

interface Player {
  id: string
  name: string
  isHost?: boolean
  connected?: boolean
  ready?: boolean
}

interface RoomState {
  roomId: string
  clients?: Array<{
    id: string
    sessionId: string
  }>
  maxClients?: number
  state?: RoomMetadata
}

interface ColyseusRoom extends Room {
  id: string
  clients: Array<{
    id: string
    sessionId: string
  }>
  maxClients: number
  state: RoomMetadata
}

export default function RoomDetailPage() {
  const { type, id } = useParams()
  const [room, setRoom] = useState<RoomState | null>(null)
  const [, setConnectionStatus] = useState<string>('Connecting...')
  const [error, setError] = useState<string | null>(null)
  const [colyseusRoom, setColyseusRoom] = useState<ColyseusRoom | null>(null)

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

        colyseusRoom.onStateChange((state: RoomMetadata) => {
          setRoom((prev) => (prev ? { ...prev, state } : null))
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

    const req = joinRoom()

    req.then((room) => {
      console.log('Joined room:', room)
    })

    return () => {
      req.then((room) => {
        room?.leave()
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

  const players: Player[] = room?.state?.players
    ? Array.from(room.state.players.entries()).map(([id, data]) => ({
        id,
        name: data.name || 'Anonymous',
        isHost: data.isHost || false,
        connected: data.connected || false,
        ready: data.ready || false,
      }))
    : []

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
              {type?.toUpperCase()}
            </Badge>
          </h1>
        </div>
      </div>

      {room && (
        <div className='flex flex-col gap-4'>
          <GameBoard
            players={players}
            gameStatus={room.state?.status || 0}
            level={JSON.parse(room.state?.test || '{}')}
            onNewGame={handleNewGame}
            onReady={handleReady}
          />
          <RoomDetail players={players} />
        </div>
      )}
    </div>
  )
}
