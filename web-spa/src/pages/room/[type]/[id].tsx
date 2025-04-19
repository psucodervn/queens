import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { client } from '@/lib/colyseus'
import { Room } from 'colyseus.js'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

interface RoomMetadata {
  displayName: string
  players: Map<string, unknown>
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
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function joinRoom() {
      if (!id) {
        setError('Room ID is required')
        return
      }

      const colyseusRoom = (await client.joinById(id)) as ColyseusRoom
      console.log('Fetched room:', colyseusRoom)

      try {
        setRoom({
          roomId: colyseusRoom.roomId,
          clients: colyseusRoom.clients,
          maxClients: colyseusRoom.maxClients,
          state: colyseusRoom.state,
        })
        setConnectionStatus('Connected')

        colyseusRoom.onStateChange((state: RoomMetadata) => {
          console.log('Room state changed:', state)
          setRoom((prev) => (prev ? { ...prev, state } : null))
        })

        colyseusRoom.onError((code, message) => {
          console.error('Room error:', { code, message })
          setError(message || 'An error occurred')
        })

        colyseusRoom.onLeave((code) => {
          console.log('Left room:', code)
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
        console.log('Leaving room:', room)
        room?.leave()
      })
    }
  }, [id])

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
          <h1 className='text-xl font-bold'>Room {room?.state?.displayName}</h1>
        </div>
        <Badge variant={connectionStatus === 'Connected' ? 'default' : 'destructive'}>{connectionStatus}</Badge>
      </div>

      {room && (
        <div className='grid gap-4'>
          <Card>
            <CardHeader className='py-3'>
              <CardTitle className='text-lg'>Room Information</CardTitle>
              <CardDescription className='text-xs'>Type: {type}</CardDescription>
            </CardHeader>
            <CardContent className='py-2'>
              <div className='space-y-1 text-sm'>
                <p>
                  <span className='font-semibold'>Room ID:</span> {room.roomId}
                </p>
                <p>
                  <span className='font-semibold'>Room Name:</span> {room.state?.displayName}
                </p>
                <p>
                  <span className='font-semibold'>Players:</span> {room.state?.players?.size || 0} /{' '}
                  {room.maxClients || '∞'}
                </p>
                <div className='flex flex-col gap-2'>
                  <span className='font-semibold'>State:</span>
                  <pre className='mt-2 p-2 bg-muted rounded-md overflow-auto text-xs'>
                    {JSON.stringify(room.state, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
