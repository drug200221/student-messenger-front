import { inject, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { env } from '../../../env/env';
import { IChat, IMessage, IParticipant } from '../components/chats/user-chats';
import { ChatService } from '../components/chats/chat.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io(env.socketConnectionUrl, {
    autoConnect: false,
  });
  private chatService = inject(ChatService);

  constructor() {
    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    this.socket.on('message', ({ recipientId, message }) => {
      this.chatService.addMessage(recipientId, message);
      console.log('Received message:', { recipientId, message });
    });

    this.socket.on('read messages', ({ message }) => {
      this.chatService.readMessages(message);
      console.log('Last read message:', { message });
    });
  }

  public connect(userId: string) {
    const sessionId = localStorage.getItem('sessionId') || '';

    this.socket.auth = { sessionId, userId };
    this.socket.connect();

    this.socket.on('session', ({ sessionId }) => {
      localStorage.setItem('sessionId', sessionId);
    });
  }

  public sendMessage(participants: IParticipant[], message: IMessage) {
    participants.forEach(participant => {
      this.socket.emit('message', { recipientId: participant.id, message: message });
    });
  }

  public markMessagesAsRead(chat: IChat) {
    const chats = this.chatService.$chats.value!;
    const lastReadMessage = chat.messages.find(message => message.id === chat.lastReadMessageId);

    if (lastReadMessage) {
      const newMessagesCount = chat.messages.filter(m => m.id > lastReadMessage.id).length;

      const index = chats.findIndex(c => c.id === chat.id);
      if (index !== -1) {
        if (chat.messages.find(m => m.id === chat.lastMessageId && +m.sender.id === chat.userId)) {
          chats[index].newMessagesCount = 0;
        } else {
          chats[index].newMessagesCount = newMessagesCount;
        }

        this.chatService.$chats.next(chats);

        this.socket.emit('read messages', { message: lastReadMessage });
      }
    }
  }

  public disconnect() {
    this.socket.disconnect();
  }
}
