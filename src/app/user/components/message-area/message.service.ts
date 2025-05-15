import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { IContactOrChatMessage, IUser } from '../chats/user-chats-and-contacts';
import { env } from '../../../../env/env';
import { IMessageRequest } from './contact-message_request';
import { SocketService } from '../../services/socket.service';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { IReadMessageRequest } from './read-message_request';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public $newContact = new BehaviorSubject<IUser | null>(null);
  private socketService = inject(SocketService);
  private http = inject(HttpClient);

  public getMessages(c: CombinedContactsAndChats, loadMessageCount: number) {
    let queryString = '';

    if (c.type === 'chat') {
      queryString = `chatId=${c.id}&load-message-count=${loadMessageCount}`;
    } else if (c.type === 'contact') {
      queryString = `contactId=${c.id}&load-message-count=${loadMessageCount}`;
    }

    return this.http.get<IApiResponse<IContactOrChatMessage[]>>(`${env.baseApiUrl}/chat-contact/?${queryString}`).pipe(
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

  public send(request: IMessageRequest) {
    return this.http.post<IApiResponse<IContactOrChatMessage>>(`${env.baseApiUrl}/chat-contact/`, request).pipe(
      tap(response => {
        if (response.result) {
          this.socketService.sendMessage(response.result);
        }
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }

  public read(c: CombinedContactsAndChats, request: IReadMessageRequest) {
    return this.http.put<IApiResponse<IContactOrChatMessage>>(`${env.baseApiUrl}/chat-contact/${c.id}`, request).pipe(
      tap(response => {
        if (response.result) {
          this.socketService.markMessagesAsRead(c);
        }
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }
}
