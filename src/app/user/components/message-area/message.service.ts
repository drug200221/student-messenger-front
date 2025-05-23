import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { IChat, IMessage, IUser } from '../chats/user-chats';
import { env } from '../../../../env/env';
import { IMessageRequest, IReadMessageRequest } from './message_request';
import { SocketService } from '../../services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public $newChat = new BehaviorSubject<IUser | null>(null);
  private socketService = inject(SocketService);
  private http = inject(HttpClient);

  public getMessages(chat: IChat, loadMessageCount: number) {
    const queryString = `chat-id=${chat.id}}&load-message-count=${loadMessageCount}`;

    return this.http.get<IApiResponse<IMessage[]>>(`${env.baseApiUrl}/chats/?${queryString}`).pipe(
      map((response) => {
        if (response.result) {
          return response.result;
        }
        return [];
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }

  public send(chat: IChat, request: IMessageRequest) {
    return this.http.post<IApiResponse<IMessage>>(`${env.baseApiUrl}/chats/`, request).pipe(
      map(response => {
        if (response.result) {
          this.socketService.sendMessage(chat.participants, response.result);
          if (chat.id < 0) {
            chat.id = response.result.chatId;
          }
        }
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }

  public read(chat: IChat, request: IReadMessageRequest) {
    return this.http.put<IApiResponse<IMessage>>(`${env.baseApiUrl}/chats/${chat.id}`, request).pipe(
      tap(response => {
        if (response.result) {
          this.socketService.markMessagesAsRead(chat);
        }
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }
}
