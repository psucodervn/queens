import Practice from '@/pages/practice/Practice'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/layouts/RootLayout'
import Home from './pages/home/Home'
import LoginPage from './pages/login'
import MultiplayerPage from './pages/multiplayer'
import ProfilePage from './pages/profile'
import RoomDetailPage from './pages/rooms/[id]'

export const routes = [
  {
    Component: RootLayout,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/practice',
        Component: Practice,
      },
      {
        path: '/multiplayer',
        Component: MultiplayerPage,
      },
      {
        path: '/rooms/:id',
        Component: RoomDetailPage,
      },
      {
        path: '/profile',
        Component: ProfilePage,
      },
      {
        path: '/login',
        Component: LoginPage,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
