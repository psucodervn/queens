import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { client } from '@/lib/colyseus'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAnonymousLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Sign in anonymously
      await client.auth.signInAnonymously({
        username,
      })
      navigate('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await client.auth.signInWithEmailAndPassword(email, password)
      navigate('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await client.auth.registerWithEmailAndPassword(email, password)
      navigate('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container flex m-auto flex-col items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-xl'>Welcome</CardTitle>
          <CardDescription>Choose your preferred way to sign in</CardDescription>
        </CardHeader>
        <Tabs defaultValue='anonymous' className='w-full'>
          <div className='mx-6 mb-4'>
            <TabsList className='w-full'>
              <TabsTrigger value='anonymous'>Guest</TabsTrigger>
              <TabsTrigger value='email' disabled>
                Email/Password
              </TabsTrigger>
              {/* <TabsTrigger value='register' disabled>
                Register
              </TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value='anonymous'>
            <form onSubmit={handleAnonymousLogin} className='space-y-4'>
              <CardContent className='space-y-4'>
                <div className='gap-2 flex flex-col'>
                  <Label htmlFor='username'>Username</Label>
                  <Input
                    id='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Enter your username'
                    required
                  />
                </div>
                {error && <p className='text-sm text-red-500'>{error}</p>}
              </CardContent>
              <CardFooter>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Continue as Guest'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value='email'>
            <form onSubmit={handleEmailPasswordLogin} className='space-y-4'>
              <CardContent className='space-y-4'>
                <div className='gap-2 flex flex-col'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    required
                  />
                </div>
                <div className='gap-2 flex flex-col'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    required
                  />
                </div>
                {error && <p className='text-sm text-red-500'>{error}</p>}
              </CardContent>
              <CardFooter>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Sign In'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value='register'>
            <form onSubmit={handleRegister} className='space-y-4'>
              <CardContent className='space-y-4'>
                <div className='gap-2 flex flex-col'>
                  <Label htmlFor='username'>Username</Label>
                  <Input
                    id='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Enter your username'
                    required
                  />
                </div>
                <div className='gap-2 flex flex-col'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    required
                  />
                </div>
                <div className='gap-2 flex flex-col'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    required
                  />
                </div>
                {error && <p className='text-sm text-red-500'>{error}</p>}
              </CardContent>
              <CardFooter>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Create Account'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
