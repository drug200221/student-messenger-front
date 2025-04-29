import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { env } from '../../../env/env';
import { Observable } from 'rxjs';
import { ContactOrChatMessage } from '../components/chats/user-chats-and-contacts';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io(env.wsConnectionUrl, {
    transports: ['websocket'],
  });

  public getMessages(): Observable<ContactOrChatMessage[]> {
    return new Observable(observer => {
      this.socket.on('message', (message) => observer.next(message));

      return () => {
        this.socket.disconnect();
      };
    });
  }

  public sendMessage(data: ContactOrChatMessage) {
    this.socket.emit(JSON.stringify(data));
  }
}
