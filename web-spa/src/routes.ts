import Practice from '@/pages/practice/Practice'
import Rooms from '@/pages/rooms/Rooms'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'
import Layout from './pages/layout'

export const routes = [
  {
    Component: Layout,
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
