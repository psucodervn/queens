import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { pb } from '@/lib/pocketbase'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isLogin) {
        await pb.collection('users').authWithPassword(username, password)
      } else {
        await pb.collection('users').create({
          username,
          email,
          password,
          passwordConfirm: password,
        })
        // After registration, log the user in
        await pb.collection('users').authWithPassword(username, password)
      }
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
      <Card className='w-full max-w-sm'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>{isLogin ? 'Login' : 'Create an account'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your email and password to login to your account'
              : 'Enter your details to create a new account'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter your username'
                required
              />
            </div>
            {!isLogin && (
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                />
              </div>
            )}
            <div className='space-y-2'>
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
          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Create account'}
            </Button>
            <Button type='button' variant='ghost' className='w-full' onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
