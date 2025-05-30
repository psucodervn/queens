import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <Link to='/practice' className='group'>
        <div className='rounded-lg bg-card p-6 hover:bg-accent transition-colors'>
          <h3 className='text-2xl font-bold mb-2'>Practice</h3>
          <p className='text-muted-foreground'>Improve your skills with our AI-powered practice mode</p>
        </div>
      </Link>
      <Link to='/lobby' className='group'>
        <div className='rounded-lg bg-card p-6 hover:bg-accent transition-colors'>
          <h3 className='text-2xl font-bold mb-2'>Multiplayer</h3>
          <p className='text-muted-foreground'>Play against other players in real-time</p>
        </div>
      </Link>
    </div>
  )
}

export default Home
