import { inject, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { env } from '../../../env/env';
import { IContactOrChatMessage } from '../components/chats/user-chats-and-contacts';
import { ChatService } from '../components/chats/chat.service';
import { CombinedContactsAndChats } from '../components/chats/combine-and-sort.messages';

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

    this.socket.on('private message', ({ message }) => {
      this.chatService.addMessage(message);
      console.log('Received private message:', { message });
    });

    this.socket.on('chat message', ({ message }) => {
      console.log('Received chat message:', { message });
    });

    this.socket.on('read messages', ({ message }) => {
      this.chatService.viewContactMessages(message);
      console.log('Read private message:', { message });
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

  public sendMessage(message: IContactOrChatMessage) {
    this.chatService.addMessage(message);

    if (message.recipientId) {
      this.socket.emit('private message', { message: message });
    } else if (message.chatId) {
      this.socket.emit('chat message', { message: message });
    }
  }

  public markMessagesAsRead(contact: CombinedContactsAndChats) {
    const contactsAndChats = this.chatService.$contactsAndChats.value!;
    const lastReadMessage = contact.messages.find(message => message.messageId === contact.lastReadMessageUserId);

    if (lastReadMessage) {
      const newMessage = contact.messages.filter(m => m.messageId > lastReadMessage.messageId).length;

      const index = contactsAndChats.findIndex(c => c.id === contact.id && contact.type === 'contact');
      if (index !== -1) {
        contactsAndChats[index].newMessagesCount = newMessage;
        this.chatService.$contactsAndChats.next(contactsAndChats);

        this.socket.emit('read messages', { message: lastReadMessage });
      }
    }
  }
}
