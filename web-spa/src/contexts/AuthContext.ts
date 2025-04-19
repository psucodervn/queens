import { createContext } from 'react'

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthContextType {
  user: Partial<User> | null
  isLoading: boolean
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
  isAuthenticated: false,
})
