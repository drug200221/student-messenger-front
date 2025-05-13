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

    this.socket.on('read messages', ({ contact }) => {
      // this.chatService.viewContactMessages(contact);
      console.log('Private message viewed:', { contact });
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
    this.socket.emit('read messages', { contact: contact });
  }
}
