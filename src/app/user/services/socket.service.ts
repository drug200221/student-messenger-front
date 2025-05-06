import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { env } from '../../../env/env';
import { IContactOrChatMessage } from '../components/chats/user-chats-and-contacts';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io(env.socketConnectionUrl, {
    autoConnect: false,
  });

  constructor() {
    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  }

  public connect(userId: string) {
    const sessionId = localStorage.getItem('sessionId')!;

    this.socket.auth = { sessionId, userId };
    this.socket.connect();

    this.socket.on('session', ({ sessionId, userId }) => {
      this.socket.auth = { sessionId, userId };
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('userId', userId);
    });
  }

  public getMessage() {
    this.socket.on('private message', ({ content, from, to }) => {
      console.log('Received private message:', { content, from, to });
    });
  }

  public sendMessage(data: IContactOrChatMessage) {
    this.socket.emit('private message', { content: JSON.stringify(data), to: data.recipientId });
  }
}
