import { Message } from '@/schema/chat'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { InboxIcon } from 'lucide-react'

interface ChatBoxProps {
  messages: Message[]
  onSend: (message: string) => void
}

export default function ChatBox({ messages, onSend }: ChatBoxProps) {
  return (
    <Card className='p-0'>
      <CardHeader className='px-4 pt-4 flex items-center'>
        <InboxIcon className='h-5 w-5' />
        <CardTitle className='p-0 text-sm'>Chatbox</CardTitle>
      </CardHeader>
      <CardContent className='px-4 pb-4'>
        <div className='h-96 overflow-y-auto scroll-auto gap-4 flex flex-col mb-4'>
          {messages.map((message) => (
            <div className='flex items-start gap-2' key={message.id}>
              <Avatar>
                <AvatarFallback className='text-xs'>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-muted-foreground'>{message.senderName}</span>
                <span className='text-xs'>{message.content}</span>
              </div>
            </div>
          ))}
        </div>
        <Input
          placeholder='Type your message here'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSend(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
        />
      </CardContent>
    </Card>
  )
}
