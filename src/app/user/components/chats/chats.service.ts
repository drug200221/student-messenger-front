import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { env } from '../../../../env/env';
import { User } from './user-chats-and-contacts';
import { combineAndSortMessages, CombinedContactsAndChats } from './combine-and-sort.messages';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  public isActiveChat = signal(false);
  public $contactsAndChats = new BehaviorSubject<CombinedContactsAndChats[]>([]);
  private http = inject(HttpClient);

  public getChatsAndContacts(): Observable<CombinedContactsAndChats[]> {
    return this.http.get<IApiResponse<User>>(`${env.baseApiUrl}`).pipe(
      map((response) => {
        this.$contactsAndChats.next(combineAndSortMessages(response.result!));
        return combineAndSortMessages(response.result!);
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }
}
