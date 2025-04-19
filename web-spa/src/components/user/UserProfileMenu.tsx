import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function UserProfileMenu() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <Button variant='outline' onClick={() => navigate('/login')} className='flex items-center gap-2'>
        Login
      </Button>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <p className='text-sm font-medium leading-none'>{user.username}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/profile.svg' alt='User avatar' />
              <AvatarFallback>
                <img src='/profile.svg' alt='User avatar' />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          {/* <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{user.username}</p>
              {user.email && <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>}
            </div>
          </DropdownMenuLabel> */}
          {isAuthenticated ? (
            <>
              {isAuthenticated && <p>Authenticated</p>}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => navigate('/login')}>Login</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
