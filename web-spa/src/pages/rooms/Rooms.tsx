import { useParams } from 'react-router-dom'

export default function Rooms() {
  const params = useParams()
  const roomId = params.roomId

  return <div>Rooms {roomId}</div>
}
