import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { pb, type GameRoom, type Player } from '@/lib/pocketbase'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function RoomDetailPage() {
  const { id } = useParams()
  const [room, setRoom] = useState<GameRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadRoom = async () => {
      try {
        setLoading(true)
        const record = await pb.collection('rooms').getOne(id, {
          expand: 'players',
        })
        record.players = record.players.map((id: string) => record.expand?.players.find((p: Player) => p.id === id))
        setRoom(record as GameRoom)
        setError(null)
      } catch (err) {
        console.error('Failed to load room:', err)
        setError('Failed to load room. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadRoom()

    // Subscribe to room updates
    pb.collection('rooms').subscribe(id, (e) => {
      setRoom(e.record as GameRoom)
    })

    return () => {
      pb.collection('rooms').unsubscribe(id)
    }
  }, [id])

  const handleReady = async () => {
    if (!room || !id) return

    try {
      const currentUser = pb.authStore.record
      if (!currentUser) return

      const updatedPlayers = room.players.map((p) => {
        if (p.id === currentUser.id) {
          return { ...p, isReady: !p.isReady }
        }
        return p
      })

      await pb.collection('players').update(currentUser.id, {
        isReady: updatedPlayers.find((p) => p.id === currentUser.id)?.isReady,
      })
    } catch (err) {
      console.error('Failed to update ready status:', err)
      setError('Failed to update ready status. Please try again.')
    }
  }

  const handleStartGame = async () => {
    if (!room || !id) return

    try {
      await pb.collection('rooms').update(id, {
        status: 'playing',
      })
    } catch (err) {
      console.error('Failed to start game:', err)
      setError('Failed to start game. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <Skeleton className='h-9 w-48 mb-2' />
            <Skeleton className='h-5 w-32' />
          </div>
          <Skeleton className='h-10 w-32' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-8'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!room) {
    return (
      <div className='container mx-auto py-8'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Room not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const currentUser = pb.authStore.model
  const isHost = currentUser?.id === room.createdBy

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>{room.name}</h1>
          <p className='text-muted-foreground'>Status: {room.status.charAt(0).toUpperCase() + room.status.slice(1)}</p>
        </div>
        {room.status === 'waiting' && isHost && (
          <Button onClick={handleStartGame} disabled={!room.players.every((p) => p.isReady)}>
            Start Game
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>
              Players ({room.players.length}/{room.maxPlayers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {room.players.map((player) => (
                <div key={player.id} className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <p className='font-medium'>{player.username}</p>
                    {player.id === room.createdBy && <span className='text-sm text-muted-foreground'>Host</span>}
                  </div>
                  {player.id === currentUser?.id && room.status === 'waiting' && (
                    <Button variant={player.isReady ? 'default' : 'outline'} onClick={handleReady}>
                      {player.isReady ? 'Ready' : 'Not Ready'}
                    </Button>
                  )}
                  {player.id !== currentUser?.id && (
                    <span className={player.isReady ? 'text-green-500' : 'text-yellow-500'}>
                      {player.isReady ? 'Ready' : 'Not Ready'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <p className='font-medium'>Room ID</p>
                <p className='text-muted-foreground'>{room.id}</p>
              </div>
              <div>
                <p className='font-medium'>Status</p>
                <p className='text-muted-foreground'>{room.status.charAt(0).toUpperCase() + room.status.slice(1)}</p>
              </div>
              <div>
                <p className='font-medium'>Time Limit</p>
                <p className='text-muted-foreground'>{room.timeLimit} seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
