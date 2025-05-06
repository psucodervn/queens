import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { client } from '@/lib/colyseus'
import { Room, RoomAvailable } from 'colyseus.js'
import { ArrowRight, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface QueenRoom extends Room {
  id: string
}

const ROOM_TYPES = [
  { value: 'queen', label: 'Queen', disabled: false },
  { value: 'tango', label: 'Tango', disabled: true },
  { value: 'zip', label: 'Zip', disabled: true },
] as const

type RoomType = (typeof ROOM_TYPES)[number]['value']

export default function LobbyPage() {
  const [rooms, setRooms] = useState<RoomAvailable[]>([])
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('queen')
  const navigate = useNavigate()

  async function setupLobby() {
    const lobby = await client.joinOrCreate('lobby')
    setConnectionStatus('Connected')

    lobby.onMessage('rooms', (rooms: RoomAvailable[]) => {
      setRooms(rooms)
    })

    lobby.onMessage('+', ([newRoomId, newRoom]) => {
      setRooms((currentRooms) => {
        const roomIndex = currentRooms.findIndex((room) => room.roomId === newRoomId)
        if (roomIndex !== -1) {
          return currentRooms.map((room) => (room.roomId === newRoomId ? newRoom : room))
        } else {
          return [...currentRooms, newRoom]
        }
      })
    })

    lobby.onMessage('-', (roomId) => {
      setRooms((currentRooms) => {
        return currentRooms.filter((room) => room.roomId !== roomId)
      })
    })

    // Add connection state change handlers
    lobby.onStateChange((state) => {
      console.log('Lobby state changed:', state)
    })

    lobby.onError((code, message) => {
      console.error('Lobby error:', { code, message })
      setConnectionStatus(`Error: ${message}`)
    })

    lobby.onLeave(() => {
      setConnectionStatus('Disconnected')
    })

    lobby.onMessage('*', (message) => {
      console.log('Lobby message:', message)
    })

    return lobby
  }

  useEffect(() => {
    const req = setupLobby()

    req.then(() => {})

    return () => {
      req.then((lobby) => {
        lobby.leave()
      })
    }
  }, [])

  // Group rooms by name
  const groupedRooms = rooms.reduce((acc, room) => {
    const name = room.name || 'Unnamed Room'
    if (!acc[name]) {
      acc[name] = []
    }
    acc[name].push(room)
    return acc
  }, {} as Record<string, RoomAvailable[]>)

  async function handleCreateRoom() {
    if (!newRoomName.trim()) return

    try {
      setIsCreatingRoom(true)
      const room = (await client.create(selectedRoomType, {
        roomName: newRoomName.trim(),
      })) as QueenRoom
      console.log('Created room:', room)
      navigate(`/room/${selectedRoomType}/${room.roomId}`)
    } catch (error) {
      console.error('Failed to create room:', error)
    } finally {
      setIsCreatingRoom(false)
      setNewRoomName('')
    }
  }

  return (
    <div className='container mx-auto py-4'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Game Lobby</h1>
        <div className='flex items-center gap-3'>
          <Badge variant={connectionStatus === 'Connected' ? 'default' : 'destructive'}>{connectionStatus}</Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button size='sm'>
                <Plus className='mr-1 h-3 w-3' />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent className='p-4'>
              <DialogHeader className='pb-2'>
                <DialogTitle className='text-lg'>Create New Room</DialogTitle>
                <DialogDescription className='text-xs'>
                  Choose a game type and enter a name for your new room.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-3 py-2'>
                <div className='grid gap-1.5'>
                  <Label htmlFor='type' className='text-xs'>
                    Game Type
                  </Label>
                  <Select value={selectedRoomType} onValueChange={(value: RoomType) => setSelectedRoomType(value)}>
                    <SelectTrigger className='h-8 text-sm'>
                      <SelectValue placeholder='Select game type' />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} disabled={type.disabled} className='text-sm'>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-1.5'>
                  <Label htmlFor='name' className='text-xs'>
                    Room Name
                  </Label>
                  <Input
                    id='name'
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder='Enter room name'
                    className='h-8 text-sm'
                  />
                </div>
              </div>
              <DialogFooter className='pt-2'>
                <Button onClick={handleCreateRoom} disabled={isCreatingRoom || !newRoomName.trim()} size='sm'>
                  {isCreatingRoom ? 'Creating...' : 'Create Room'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='space-y-4'>
        {Object.entries(groupedRooms).map(([name, rooms], idx) => (
          <div key={name}>
            {idx > 0 && <Separator className='my-4' />}
            <h2 className='text-lg font-semibold mb-2'>{name}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {rooms.map((room) => (
                <Card key={room.roomId} className='hover:shadow-lg transition-shadow'>
                  <CardHeader className='py-2'>
                    <CardTitle className='text-base'>{room.metadata?.displayName || 'Room ' + room.roomId}</CardTitle>
                    <CardDescription>
                      <Badge variant='secondary' className='text-xs'>
                        {room.clients} / {room.maxClients} Players
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='py-2'>
                    <Button asChild className='mt-2 w-full text-sm h-8'>
                      <Link to={`/room/${room.name}/${room.roomId}`}>
                        View Room
                        <ArrowRight className='ml-1 h-3 w-3' />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
