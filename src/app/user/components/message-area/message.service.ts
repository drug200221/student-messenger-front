import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { ContactOrChatMessage } from '../chats/user-chats-and-contacts';
import { env } from '../../../../env/env';
import { IContactMessageRequest } from './contact-message_request';
import { SocketService } from '../../services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public $messages = new BehaviorSubject<ContactOrChatMessage[]>([]);
  private socketService = inject(SocketService);
  private http = inject(HttpClient);

  public getMessages(params: HttpParams) {
    return this.http.get<IApiResponse<ContactOrChatMessage[]>>(`${env.baseApiUrl}/chat-contact/`, { params }).pipe(
      map((response) => {
        if (response.result) {
          this.$messages.next(response.result);
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

  public send(request: IContactMessageRequest) {
    return this.http.post<IApiResponse<ContactOrChatMessage>>(`${env.baseApiUrl}/chat-contact/`, request).pipe(
      tap(response => {
        if (response.result) {
          this.$messages.value.push(response.result);
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
