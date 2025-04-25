import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { ChatMessage, ContactMessage } from '../chats/user-chats-and-contacts';
import { env } from '../../../../env/env';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public $messages = new BehaviorSubject<ContactMessage[] | ChatMessage[]>([]);
  private http = inject(HttpClient);

  public getMessages(params: HttpParams) {
    return this.http.get<IApiResponse<ContactMessage[] | ChatMessage[]>>(`${env.baseApiUrl}/chat-contact/`, { params }).pipe(
      map((response) => {
        this.$messages.next(response.result!);
        console.log(response);
        return response.result!;
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }
}
