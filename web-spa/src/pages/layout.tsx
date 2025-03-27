import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='min-h-screen bg-background w-full'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='flex h-14 items-center px-4 md:px-6 lg:px-8'>
          {/* Logo */}
          <div className='mr-4 flex'>
            <Link to='/' className='mr-6 flex items-center space-x-2'>
              <img src='/queen.svg' alt='Queen Logo' width={32} height={32} />
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[240px] sm:w-[280px]'>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col space-y-4 mt-4'>
                <a href='/' className='text-sm font-medium transition-colors hover:text-primary'>
                  Home
                </a>
                <a href='/practice' className='text-sm font-medium transition-colors hover:text-primary'>
                  Practice
                </a>
                <a href='/multiplayer' className='text-sm font-medium transition-colors hover:text-primary'>
                  Multiplayer
                </a>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation Items */}
          <div className='hidden md:flex flex-1 items-center justify-center space-x-6'>
            <NavLink to='/practice' className='text-sm font-medium transition-colors hover:text-primary'>
              Practice
            </NavLink>
            <NavLink to='/multiplayer' className='text-sm font-medium transition-colors hover:text-primary'>
              Multiplayer
            </NavLink>
          </div>

          {/* User Profile */}
          <div className='flex items-center justify-end space-x-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src='/avatars/01.png' alt='User avatar' />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>User Name</p>
                    <p className='text-xs leading-none text-muted-foreground'>user@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className='px-4 md:px-6 lg:px-8 py-6'>
        <Outlet />
      </main>
    </div>
  )
}
