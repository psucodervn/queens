import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { pb } from '@/lib/pocketbase'
import { RecordModel } from 'pocketbase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const [user, setUser] = useState<RecordModel | null>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = pb.authStore.record
    if (!currentUser) {
      navigate('/login')
      return
    }

    setUser(currentUser)
    setUsername(currentUser.username)
    setEmail(currentUser.email)
  }, [navigate])

  const handleUpdateProfile = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      const updatedUser = await pb.collection('users').update(user.id, {
        username,
        email,
      })
      setUser(updatedUser)
      setError('')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className='container max-w-2xl py-8'>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter your username'
            />
          </div>

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

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <div className='flex justify-end'>
            <Button onClick={handleUpdateProfile} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
