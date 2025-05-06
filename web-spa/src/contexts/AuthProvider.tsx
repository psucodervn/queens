import { client } from '@/lib/colyseus'
import { useEffect, useState } from 'react'
import { AuthContext, User } from './AuthContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => client.auth.signOut()

  const signInAnonymously = () => {
    client.auth
      .signInAnonymously({
        username: 'Anonymous',
      })
      .then((user) => {
        console.log('Signed in anonymously', user)
      })
      .catch((error) => {
        console.error('Error signing in anonymously', error)
      })
  }

  useEffect(() => {
    const unsubscribe = client.auth.onChange((authData) => {
      // console.log('Auth data changed:', authData)
      if (authData.user) {
        authData.user.id ??= authData.user.anonymousId
      }
      setIsLoading(false)
      setUser(authData?.user || null)
      setIsAuthenticated(!authData?.user?.anonymous)

      if (authData?.token === null) {
        signInAnonymously()
      }
    })

    if (!client.auth.token) {
      signInAnonymously()
    }

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, isLoading, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}
