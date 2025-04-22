import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Users } from 'lucide-react'

interface Player {
  id: string
  name: string
  connected?: boolean
  ready?: boolean
  submitted?: string
  submittedAt?: number
}

export default function RoomDetail({ players }: { players: Player[] }) {
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
                <span className='text-sm text-muted-foreground w-6'>{index + 1}.</span>
                <span className={cn('text-sm', !player.connected && 'text-gray-400 italic')}>{player.name}</span>
              </div>
              <div className='flex items-center gap-2'>
                {!player.connected && (
                  <Badge variant='outline' className='text-xs text-red-600 border-red-500/20'>
                    Inactive
                  </Badge>
                )}
                {player.connected && player.ready && (
                  <Badge variant='outline' className='text-xs text-green-600 border-green-500/20'>
                    Ready
                  </Badge>
                )}
                {player.submitted && (
                  <Badge variant='outline' className='text-xs'>
                    Submitted
                  </Badge>
                )}
              </div>
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
