import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@radix-ui/react-switch'
import { Table } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDuration } from '@/lib/utils'
import { calculateEloChanges } from '@/lib/api'

const MAX_TIME = 120
const DNF_PENALTY_TIME = MAX_TIME * 5

interface Player {
  id: number
  rating: number
  newRating?: number
  dnf: boolean
  finishTime?: number
}

function randomPlayer(id: number) {
  const currentRating = 1200 // Math.floor(Math.random() * 400) + 1000
  const finishTime = Math.floor(Math.random() * 150) + 1
  const dnf = finishTime > MAX_TIME
  return { id, rating: currentRating, finishTime: dnf ? DNF_PENALTY_TIME : finishTime, dnf }
}

export default function TestEloPage() {
  const [playerCount, setPlayerCount] = useState<number>(4)
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayers, setNewPlayers] = useState<Player[]>([])
  const [calculated, setCalculated] = useState<boolean>(false)

  // Initialize players
  useEffect(() => {
    const newCreatedPlayers = Array.from({ length: playerCount }, (_, i) => randomPlayer(i + 1))
    setPlayers(newCreatedPlayers)
    setCalculated(false)
  }, [playerCount])

  useEffect(() => {
    handleEloChanges()
  }, [players])

  const handleEloChanges = async () => {
    // get elo changes from server
    const data = await calculateEloChanges(
      players.map((p) => ({ ...p, finishTime: p.dnf ? DNF_PENALTY_TIME : p.finishTime! })),
    )
    setNewPlayers(data)
    setCalculated(true)
  }

  const updateFinishTime = (playerId: number, time: number) => {
    setPlayers(players.map((p) => (p.id === playerId ? { ...p, finishTime: time } : p)))
    setCalculated(false)
  }

  const toggleDnf = (playerId: number) => {
    setPlayers(players.map((p) => (p.id === playerId ? { ...p, dnf: !p.dnf } : p)))
    setCalculated(false)
  }

  const updatePlayerRating = (playerId: number, rating: number) => {
    setPlayers(players.map((p) => (p.id === playerId ? { ...p, rating } : p)))
    setCalculated(false)
  }

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.dnf && !b.dnf) return 1
    if (!a.dnf && b.dnf) return -1
    if (a.dnf && b.dnf) return 0
    return a.finishTime! - b.finishTime!
  })

  const sortedNewPlayers = [...newPlayers].sort((a, b) => {
    if (a.dnf && !b.dnf) return 1
    if (!a.dnf && b.dnf) return -1
    if (a.dnf && b.dnf) return 0
    return a.finishTime! - b.finishTime!
  })

  const randomizePlayers = () => {
    const newCreatedPlayers = Array.from({ length: playerCount }, (_, i) => randomPlayer(i + 1))
    setPlayers(newCreatedPlayers)
    setCalculated(false)
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>ELO Rating Calculator</h1>
        <div className='flex gap-4'>
          <Select value={playerCount.toString()} onValueChange={(value) => setPlayerCount(Number(value))}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Select players' />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 8, 10].map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} Players
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={randomizePlayers}>Randomize</Button>
          <Button onClick={handleEloChanges} disabled={calculated} className='bg-primary hover:bg-primary/90'>
            Calculate ELO
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-4'>Player Settings</h2>
          <div className='space-y-4'>
            {sortedPlayers.map((player) => (
              <div key={player.id} className='flex items-center justify-between p-4 bg-muted rounded-lg'>
                <div className='flex items-center gap-4'>
                  <div className='flex flex-col'>
                    <div className='flex gap-2 items-center'>
                      <span className='font-medium'>{`Player ${player.id}`}</span>
                      <Input
                        type='number'
                        value={player.rating}
                        onChange={(e) => updatePlayerRating(player.id, Number(e.target.value))}
                        className='w-24'
                        min='1000'
                        max='3000'
                      />
                      <div className='relative'>
                        <Input
                          type='number'
                          value={player.finishTime || ''}
                          onChange={(e) => updateFinishTime(player.id, Number(e.target.value))}
                          className='w-24 pl-8'
                          min='1'
                          max={DNF_PENALTY_TIME}
                          disabled={player.dnf}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      id={`player-${player.id}-dnf`}
                      checked={player.dnf}
                      onCheckedChange={() => toggleDnf(player.id)}
                      className='data-[state=checked]:bg-destructive'
                    >
                      DNF
                    </Switch>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-4'>Results</h2>
          {calculated ? (
            <div className='space-y-4'>
              {sortedNewPlayers.map((player) => (
                <div key={player.id} className='flex items-center justify-between p-4 bg-muted rounded-lg'>
                  <div className='flex items-center gap-4'>
                    <span className='font-medium'>{`Player ${player.id}`}</span>
                    <div className='flex flex-col'>
                      <span className='text-sm'>
                        Time: {player.dnf ? 'DNF' : formatDuration(player.finishTime!, 'seconds')}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm'>Initial: {player.rating}</span>
                    <span className='text-sm'>New: {player.newRating}</span>
                    <span
                      className={`text-sm ${player.newRating! > player.rating ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {player.newRating! > player.rating ? '+' : '-'}
                      {Math.abs(player.newRating! - player.rating)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-muted-foreground'>
              <Table className='w-12 h-12 mx-auto' />
              <p className='mt-2'>Calculate ELO to see results</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
