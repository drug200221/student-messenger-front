import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { Chat, Contact, User } from './user-chats-and-contacts';
import { env } from '../../../../env/env';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  public isActiveChat = signal(false);
  public $chats = new BehaviorSubject<Chat[]>([]);
  public $contacts = new BehaviorSubject<Contact[]>([]);
  private http = inject(HttpClient);

  public getChatsAndContacts() {
    return this.http.get<IApiResponse<User>>(`${env.baseApiUrl}`).pipe(
      map((response) => {
        this.$chats.next(response.result!.chats);
        this.$contacts.next(response.result!.contacts);

        return response.result;
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }
}
