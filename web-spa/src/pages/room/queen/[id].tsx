import { Room } from 'colyseus.js'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { client } from '@/lib/colyseus'
import { Board } from '@/lib/game/board'
import GameBoard from './GameBoard'
import RoomDetail from './RoomDetail'
import { QueenRoomState } from '@/schema/queen'
import ChatBox from '@/components/chat/ChatBox'

export default function QueenRoomDetailPage() {
  const GAME_TYPE = 'queen'

  const { user } = useAuth()
  const { id } = useParams()
  const [room, setRoom] = useState<Room | null>(null)
  const [state, setState] = useState<QueenRoomState | null>(null)
  const [, setConnectionStatus] = useState<string>('Connecting...')
  const [error, setError] = useState<string | null>(null)

  let req: Promise<Room | undefined> = Promise.resolve(undefined)

  const currentPlayer = useMemo(() => {
    if (!user || !user.id || !state) return
    return state.players.get(user.id)
  }, [state, user])

  const chatMessages = useMemo(() => {
    return (
      state?.chats
        .map((message) => ({
          id: message.id,
          senderId: message.senderId,
          senderName: message.senderName,
          content: message.content,
        }))
        .reverse() || []
    )
  }, [state?.chats.values()])

  useEffect(() => {
    async function joinRoom() {
      if (!id) {
        setError('Room ID is required')
        return
      }

      const colyseusRoom = await client.joinById<QueenRoomState>(id)

      try {
        setRoom(colyseusRoom)
        setConnectionStatus('Connected')

        colyseusRoom.onStateChange((state: QueenRoomState) => {
          console.log('Room state changed:', state)
          setState((prev) => ({ ...prev, ...state }))
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
    if (!room) return
    try {
      room.send('new-game')
    } catch (error) {
      console.error('Failed to start new game:', error)
      setError('Failed to start new game')
    }
  }

  const handleReady = async () => {
    if (!room) return
    try {
      room.send('ready', true)
    } catch (error) {
      console.error('Failed to set ready status:', error)
      setError('Failed to set ready status')
    }
  }

  const handleStart = async () => {
    if (!room) return
    try {
      room.send('start')
    } catch (error) {
      console.error('Failed to start game:', error)
      setError('Failed to start game')
    }
  }

  const handleFinish = async (board: Board) => {
    console.log('handleFinish', board)
    if (!room) return

    try {
      room.send('submit', JSON.stringify(board))
    } catch (error) {
      console.error('Failed to submit board:', error)
      setError('Failed to submit board')
    }
  }

  const handleChat = async (message: string) => {
    if (!room) return
    try {
      room.send('chat', message)
    } catch (error) {
      console.error('Failed to send chat message:', error)
      setError('Failed to send chat message')
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
                Lobby
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
              Lobby
            </Link>
          </Button>
          <h1 className='text-xl font-bold'>
            {room?.state?.displayName}
            <Badge variant='secondary' className='text-xs mx-4'>
              {GAME_TYPE.toUpperCase()}
            </Badge>
          </h1>
        </div>
      </div>

      {state?.displayName && (
        <div className='flex flex-col gap-4 md:grid md:grid-cols-3'>
          <div className='md:col-span-2'>
            <GameBoard
              state={state}
              onNewGame={handleNewGame}
              onReady={handleReady}
              onStart={handleStart}
              onFinish={handleFinish}
              currentPlayer={currentPlayer}
            />
          </div>
          <div className='md:col-span-1 flex flex-col gap-4'>
            <RoomDetail state={state} />
            <ChatBox messages={chatMessages} onSend={handleChat} />
          </div>
        </div>
      )}
    </div>
  )
}
