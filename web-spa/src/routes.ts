import Practice from '@/pages/practice/Practice'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/layouts/RootLayout'
import Home from './pages/home'
import LobbyPage from './pages/lobby'
import LoginPage from './pages/login'
import MultiplayerPage from './pages/multiplayer'
import ProfilePage from './pages/profile'
import QueenRoomDetailPage from './pages/room/queen/[id]'

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
        path: '/profile',
        Component: ProfilePage,
      },
      {
        path: '/login',
        Component: LoginPage,
      },
      {
        path: '/lobby',
        Component: LobbyPage,
      },
      {
        path: '/room/queen/:id',
        Component: QueenRoomDetailPage,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
