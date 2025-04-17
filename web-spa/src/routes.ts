import Practice from '@/pages/practice/Practice'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/layouts/RootLayout'
import Home from './pages/home/Home'
import MultiplayerPage from './pages/multiplayer'
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
    ],
  },
]

export const router = createBrowserRouter(routes)
