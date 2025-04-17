import pb from '@/lib/pocketbase'
import { useEffect, useState } from 'react'

export default function Multiplayer() {
  const [record, setRecord] = useState<unknown | null>(null)

  useEffect(() => {
    pb.collection('rooms').subscribe('*', (e) => {
      console.log(e)
      setRecord(e.record)
    })

    return () => {
      pb.collection('rooms').unsubscribe('*')
    }
  }, [])

  return <div>{JSON.stringify(record)}</div>
}
