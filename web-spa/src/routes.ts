import LevelPage from '@/pages/practice/Level'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/layouts/RootLayout'
import Home from './pages/home'
import LobbyPage from './pages/lobby'
import LoginPage from './pages/login'
import ProfilePage from './pages/profile'
import QueenRoomDetailPage from './pages/room/queen/[id]'
import TestEloPage from './pages/room/queen/test-elo'
import Practice from './pages/practice'

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
        path: '/practice/:id',
        Component: LevelPage,
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
      {
        path: '/room/queen/test-elo',
        Component: TestEloPage,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
