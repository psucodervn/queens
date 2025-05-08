import { Message as GeneratedMessage } from './generated/Message'

export type Message = Pick<GeneratedMessage, 'senderId' | 'content' | 'id' | 'senderName'> & {}
