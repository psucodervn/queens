import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { UserProfileMenu } from '@/components/user/UserProfileMenu'
import { Menu } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='min-h-screen bg-background w-full'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='flex h-14 items-center px-4 md:px-6 lg:px-8 justify-between'>
          {/* Logo */}
          <div className='mr-4 flex'>
            <Link to='/' className='mr-6 flex items-center space-x-2'>
              <img src='/queen.svg' alt='Queen Logo' width={32} height={32} />
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className='sm:hidden'>
              <Button variant='ghost' size='icon' className='border'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[240px] sm:w-[280px] bg-background p-6'>
              <div className='flex flex-col space-y-6'>
                {/* Logo in mobile menu */}
                <div className='flex items-center space-x-2 mb-4'>
                  <img src='/queen.svg' alt='Queen Logo' width={32} height={32} />
                  <h2 className='text-xl font-bold'>Queens</h2>
                </div>

                {/* Main Navigation */}
                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-muted-foreground'>Main</h3>
                  <nav className='space-y-1'>
                    <Button asChild variant='ghost' className='w-full justify-start'>
                      <NavLink to='/' className='text-sm font-medium'>
                        Home
                      </NavLink>
                    </Button>
                    <Button asChild variant='ghost' className='w-full justify-start'>
                      <NavLink to='/practice' className='text-sm font-medium'>
                        Practice
                      </NavLink>
                    </Button>
                    <Button asChild variant='ghost' className='w-full justify-start'>
                      <NavLink to='/lobby' className='text-sm font-medium'>
                        Multiplayer
                      </NavLink>
                    </Button>
                  </nav>
                </div>

                {/* User Profile */}
                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-muted-foreground'>Profile</h3>
                  <UserProfileMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation Items */}
          <div className='hidden sm:flex flex-1 items-center justify-center space-x-6'>
            <NavLink to='/practice' className='text-sm font-medium transition-colors hover:text-primary'>
              Practice
            </NavLink>
            <NavLink to='/lobby' className='text-sm font-medium transition-colors hover:text-primary'>
              Multiplayer
            </NavLink>
          </div>

          {/* User Profile */}
          <div className='items-center justify-end space-x-4 hidden sm:flex'>
            <UserProfileMenu />
          </div>
        </div>
      </header>
      <main className='px-4 md:px-6 lg:px-8 py-6'>
        <Outlet />
      </main>
    </div>
  )
}
