import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { IContactOrChatMessage, IUser } from '../chats/user-chats-and-contacts';
import { env } from '../../../../env/env';
import { IMessageRequest } from './contact-message_request';
import { SocketService } from '../../services/socket.service';
import { ChatService } from '../chats/chat.service';
import { ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public $newContact = new BehaviorSubject<IUser | null>(null);
  private socketService = inject(SocketService);
  private chatService = inject(ChatService);
  private http = inject(HttpClient);

  public getMessages(param: ParamMap) {
    let queryString = '';

    if (param.has('chatId')) {
      const chatId = param.get('chatId');
      queryString = `chatId=${chatId}`;
    } else if (param.has('contactId')) {
      const contactId = param.get('contactId');
      queryString = `contactId=${contactId}`;
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
          console.log(response.result);
          this.chatService.addMessage(response.result);
          this.socketService.sendMessage(response.result);
        }
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }
}
