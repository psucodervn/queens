import Practice from '@/pages/practice/Practice'
import Rooms from '@/pages/rooms/Rooms'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/layouts/RootLayout'
import Home from './pages/home/Home'

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
        path: '/rooms/:roomId',
        Component: Rooms,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
