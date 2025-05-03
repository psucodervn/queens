import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatDuration } from '@/lib/utils'
import { PlayerStatus } from '@/schema/enums'
import { Player } from '@/schema/Player'
import { QueenRoomState } from '@/schema/QueenRoomState'
import { Users } from 'lucide-react'
import { useMemo } from 'react'

export interface RoomDetailProps {
  state: QueenRoomState
}

export default function RoomDetail({ state }: RoomDetailProps) {
  const players = useMemo(() => {
    return state.players
      .values()
      .toArray()
      .toSorted((a, b) => {
        if (a.submitted && b.submitted) {
          return a.submittedAt - b.submittedAt
        }
        if (a.submitted) {
          return -1
        }
        if (b.submitted) {
          return 1
        }
        return a.name.localeCompare(b.name)
      })
  }, [state.players.values().toArray()])

  const renderPlayerStatus = (player: Player) => {
    switch (player.status) {
      case PlayerStatus.READY:
        return (
          <Badge variant='outline' className='text-xs text-green-600 border-green-500/20'>
            Ready
          </Badge>
        )
      case PlayerStatus.PLAYING:
        return (
          <Badge variant='outline' className='text-xs text-blue-600 border-blue-500/20'>
            Playing
          </Badge>
        )
      case PlayerStatus.SUBMITTED:
        return (
          <Badge variant='outline' className='text-xs text-green-600 border-blue-500/20'>
            {formatDuration(player.submittedAt - state.gameStartedAt)}
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader className='py-3'>
        <div className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          <CardTitle className=''>Players</CardTitle>
        </div>
        <CardDescription className='text-xs'>
          {players.length} player{players.length !== 1 ? 's' : ''} in the room
        </CardDescription>
      </CardHeader>
      <CardContent className='py-2'>
        <div className='grid gap-2'>
          {players.map((player, index) => (
            <div
              key={player.id}
              className='flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors'
            >
              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground w-4'>{index + 1}.</span>
                <span className={cn('text-sm', !player.active && 'text-gray-400 italic')}>{player.name}</span>
              </div>
              <div className='flex items-center gap-2'>{renderPlayerStatus(player)}</div>
            </div>
          ))}
          {players.length === 0 && (
            <div className='text-center py-4 text-muted-foreground text-sm'>No players in the room</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
