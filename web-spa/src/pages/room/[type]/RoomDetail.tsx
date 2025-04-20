import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

interface Player {
  id: string
  name: string
  isHost?: boolean
  connected?: boolean
  ready?: boolean
}

export default function RoomDetail({ players }: { players: Player[] }) {
  return (
    <Card>
      <CardHeader className='py-3'>
        <div className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          <CardTitle className='text-lg'>Players</CardTitle>
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
                <span className='font-medium'>{player.name}</span>
                <div className='flex gap-1'>
                  {player.isHost && (
                    <Badge variant='secondary' className='text-xs'>
                      Host
                    </Badge>
                  )}
                  {player.connected ? (
                    <Badge variant='default' className='text-xs'>
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant='destructive' className='text-xs'>
                      Disconnected
                    </Badge>
                  )}
                  {player.ready && (
                    <Badge variant='outline' className='text-xs bg-green-500/10 text-green-500 border-green-500/20'>
                      Ready
                    </Badge>
                  )}
                </div>
              </div>
              <Badge variant='outline' className='text-xs'>
                {player.id.slice(0, 8)}...
              </Badge>
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
