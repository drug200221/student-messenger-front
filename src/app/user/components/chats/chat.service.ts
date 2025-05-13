import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { env } from '../../../../env/env';
import { IContactOrChat, IContactOrChatMessage, IUser } from './user-chats-and-contacts';
import { combineAndSortMessages, CombinedContactsAndChats } from './combine-and-sort.messages';
import { SidenavService } from '../../../shared/sidenav/sidenav.service';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public isActiveChatId = signal(-1);
  public isActiveContactId = signal(-1);
  public $contacts = new BehaviorSubject<IContactOrChat[]>([]);
  public $chats = new BehaviorSubject<IContactOrChat[]>([]);
  public $contactsAndChats = new BehaviorSubject<CombinedContactsAndChats[] | null>(null);
  private sidenavService = inject(SidenavService);
  private userService = inject(UserService);
  private http = inject(HttpClient);

  public search(text: string) {
    return this.http.get<IApiResponse<IUser[]>>(`${env.baseApiUrl}?search=${text}`).pipe(
      map(response => {
        if (response.result) {
          return response.result;
        }
        return [];
      })
    );
  }

  public getChatsAndContacts() {
    return this.http.get<IApiResponse<IUser>>(`${env.baseApiUrl}`).pipe(
      tap((response) => {
        if (response.result) {
          this.userService.$user.next(response.result);
          this.$contacts.next(response.result.contacts);
          this.$chats.next(response.result.chats);
          this.$contactsAndChats.next(combineAndSortMessages(response.result));
        }
        if (response.error) {
          if (response.error.code === 403) {
            window.alert('Авторизуйтесь `http://localhost:8080/student`'); // TODO: заменить ссылку или переделать
          }
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
    const currentContactsAndChats = this.$contactsAndChats.getValue()!;

    let c = -1;
    if (message.chatId) {
      c = currentContactsAndChats.findIndex(c => c.id === message.chatId && c.type === 'chat');
    } else if (message.recipientId) {
      c = currentContactsAndChats.findIndex(
        c => c.id === message.recipientId && c.type === 'contact' ||
          c.id === +message.sender.id && c.type === 'contact'
      );
    }

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

  // public viewContactMessages(contact: IContactOrChat) {
  //   const index = this.$contactsAndChats.value!.findIndex(c => c.id === contact.id);
  //   if (index !== -1) {
  //     const contacts = [...this.$contactsAndChats.value!];
  //     contacts[index] = { ...contacts[index], lastReadMessageContactId: messageId };
  //     this.$contactsAndChats.next(contacts);
  //   }
  // }
}
