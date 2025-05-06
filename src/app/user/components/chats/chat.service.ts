import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { env } from '../../../../env/env';
import { IContactOrChat, IContactOrChatMessage, IUser } from './user-chats-and-contacts';
import { combineAndSortMessages, CombinedContactsAndChats } from './combine-and-sort.messages';
import { SocketService } from '../../services/socket.service';
import { SidenavService } from '../../../shared/sidenav/sidenav.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public isActiveChatId = signal(-1);
  public isActiveContactId = signal(-1);
  public $user = new BehaviorSubject<IUser | null>(null);
  public $contacts = new BehaviorSubject<IContactOrChat[]>([]);
  public $chats = new BehaviorSubject<IContactOrChat[]>([]);
  public $contactsAndChats = new BehaviorSubject<CombinedContactsAndChats[]>([]);
  private socketService = inject(SocketService);
  private sidenavService = inject(SidenavService);
  private http = inject(HttpClient);

  public getChatsAndContacts(): Observable<CombinedContactsAndChats[]> {
    return this.http.get<IApiResponse<IUser>>(`${env.baseApiUrl}`).pipe(
      map((response) => {
        if (response.result) {
          this.$user.next(response.result);
          this.socketService.connect(`${response.result.id}`);

          this.$contacts.next(response.result.contacts);
          this.$chats.next(response.result.chats);
          this.$contactsAndChats.next(combineAndSortMessages(response.result));

          return combineAndSortMessages(response.result);
        }
        return [];
      }),
      catchError((error) => {
        console.log(error);
        return of();
      })
    );
  }

  public addMessage(message: IContactOrChatMessage): void {
    const currentContactsAndChats = this.$contactsAndChats.getValue();

    let c = -1;
    if (message.chatId) {
      c = currentContactsAndChats.findIndex(c => c.id === message.chatId && c.type === 'chat');
    } else if (message.recipientId) {
      c = currentContactsAndChats.findIndex(c => c.id === message.recipientId && c.type === 'contact');
    }
    console.log(c);
    if (c !== -1) {
      currentContactsAndChats[c].messages.push(message);
      this.$contactsAndChats.next([...currentContactsAndChats]);
    }
  }

  public setActive(c: CombinedContactsAndChats) {
    if (window.innerWidth <= 600) {
      this.sidenavService.isSidenavOpened = signal(false);
    }

    this.isActiveChatId = signal(-1);
    this.isActiveContactId = signal(-1);

    if (c.type === 'contact') {
      this.isActiveContactId = signal(c.id);
    } else if (c.type === 'chat') {
      this.isActiveChatId = signal(c.id);
    }
  }
}
