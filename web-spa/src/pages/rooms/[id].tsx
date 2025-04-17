import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

interface Player {
  id: string
  name: string
  isHost: boolean
  isReady: boolean
}

interface RoomDetail {
  id: string
  name: string
  status: 'waiting' | 'playing' | 'finished'
  players: Player[]
  maxPlayers: number
}

export default function RoomDetailPage() {
  const { id } = useParams()
  const [room, setRoom] = useState<RoomDetail>({
    id: id || '',
    name: 'Room 1',
    status: 'waiting',
    maxPlayers: 4,
    players: [
      { id: '1', name: 'Player 1', isHost: true, isReady: true },
      { id: '2', name: 'Player 2', isHost: false, isReady: false },
    ],
  })

  const handleReady = () => {
    setRoom((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === '1' ? { ...p, isReady: !p.isReady } : p)),
    }))
  }

  const handleStartGame = () => {
    if (room.players.every((p) => p.isReady)) {
      setRoom((prev) => ({ ...prev, status: 'playing' }))
    }
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>{room.name}</h1>
          <p className='text-muted-foreground'>Status: {room.status.charAt(0).toUpperCase() + room.status.slice(1)}</p>
        </div>
        {room.status === 'waiting' && (
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
                    <p className='font-medium'>{player.name}</p>
                    {player.isHost && <span className='text-sm text-muted-foreground'>Host</span>}
                  </div>
                  {player.id === '1' && room.status === 'waiting' && (
                    <Button variant={player.isReady ? 'default' : 'outline'} onClick={handleReady}>
                      {player.isReady ? 'Ready' : 'Not Ready'}
                    </Button>
                  )}
                  {player.id !== '1' && (
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
