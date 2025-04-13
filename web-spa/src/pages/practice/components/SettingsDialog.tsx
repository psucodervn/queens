import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Settings } from 'lucide-react'

interface SettingsDialogProps {
  showClashingQueens: boolean
  toggleShowClashingQueens: () => void
  autoPlaceXs: boolean
  toggleAutoPlaceXs: () => void
  showClock: boolean
  toggleShowClock: () => void
}

const SettingsDialog = ({
  showClashingQueens,
  toggleShowClashingQueens,
  autoPlaceXs,
  toggleAutoPlaceXs,
  showClock,
  toggleShowClock,
}: SettingsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className='rounded-full border border-slate-500 p-2 hover:cursor-pointer'>
              <Settings size='18' />
            </button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className='bg-background sm:max-w-[425px]' aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className='mb-2'>Settings</DialogTitle>
        </DialogHeader>
        <div className='h-fit space-y-1'>
          <div className='flex items-center justify-between space-x-3'>
            <div>Show Clock</div>
            <Switch checked={showClock} onCheckedChange={toggleShowClock} disabled />
          </div>
          <div className='flex items-center justify-between space-x-3'>
            <div>Auto Place Xs</div>
            <Switch checked={autoPlaceXs} onCheckedChange={toggleAutoPlaceXs} />
          </div>
          <div className='flex items-center justify-between space-x-3'>
            <div>Show Clashing Queens</div>
            <Switch checked={showClashingQueens} onCheckedChange={toggleShowClashingQueens} disabled />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
