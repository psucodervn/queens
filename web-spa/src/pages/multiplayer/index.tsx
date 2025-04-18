import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { pb, type GameRoom } from '@/lib/pocketbase'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function MultiplayerPage() {
  const [rooms, setRooms] = useState<GameRoom[]>([])
  const [newRoomName, setNewRoomName] = useState('')

  useEffect(() => {
    loadRooms()

    pb.collection('rooms').subscribe('*', () => {
      loadRooms()
    })

    return () => {
      pb.collection('rooms').unsubscribe()
    }
  }, [])

  const loadRooms = async () => {
    try {
      const records = await pb.collection('rooms').getList(1, 50, {
        sort: '-updated',
        filter: 'players:length > 0',
      })
      setRooms(records.items as GameRoom[])
    } catch (error) {
      console.error('Failed to load rooms:', error)
    }
  }

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return

    try {
      const data = {
        name: newRoomName,
        players: 1,
        maxPlayers: 4,
        status: 'waiting',
      }

      await pb.collection('rooms').create(data)
      setNewRoomName('')
      loadRooms()
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Multiplayer Rooms</h1>
        <div className='flex gap-4'>
          <Input
            placeholder='Room name'
            value={newRoomName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoomName(e.target.value)}
            className='w-64'
          />
          <Button onClick={handleCreateRoom}>Create Room</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {rooms.map((room) => (
          <Link to={`/rooms/${room.id}`} key={room.id}>
            <Card className='hover:bg-accent transition-colors cursor-pointer'>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>Status: {room.status.charAt(0).toUpperCase() + room.status.slice(1)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Players: {room.players.length}/{room.maxPlayers}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
