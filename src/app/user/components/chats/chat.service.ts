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

    if (message.chatId) {
      // const index = currentContactsAndChats.findIndex(c => c.id === message.chatId && c.type === 'chat');
    } else if (message.recipientId) {
      const recipientIndex = currentContactsAndChats.findIndex(
        c => c.id === message.recipientId && c.type === 'contact'
      );
      const senderIndex = currentContactsAndChats.findIndex(
        c => c.id === +message.sender.id && c.type === 'contact'
      );

      if (recipientIndex !== -1) {
        currentContactsAndChats[recipientIndex].messages.push(message);
      }
      if (senderIndex !== -1) {
        if (currentContactsAndChats[senderIndex].id !== this.userService.$user.value?.id) {
          currentContactsAndChats[senderIndex].newMessagesCount++;
          currentContactsAndChats[senderIndex].messages.push(message);
        }
      }
    }

    this.$contactsAndChats.next(currentContactsAndChats);
  }

  public setActive(cId: number, type: string) {
    if (window.innerWidth <= 600) {
      this.sidenavService.isSidenavOpened = signal(false);
    }

    this.isActiveChatId = signal(-1);
    this.isActiveContactId = signal(-1);

    if (type === 'contact') {
      this.isActiveContactId = signal(cId);
    } else if (type === 'chat') {
      this.isActiveChatId = signal(cId);
    }
  }

  public viewContactMessages(message: IContactOrChatMessage) {
    const currentContactsAndChats = this.$contactsAndChats.getValue()!;

    let index = -1;
    if (message.chatId) {
      index = currentContactsAndChats.findIndex(c => c.id === message.chatId && c.type === 'chat');
    } else if (message.recipientId) {
      index = currentContactsAndChats.findIndex(
        c => c.id === message.recipientId && c.type === 'contact'
      );
    }

    if (index !== -1) {
      currentContactsAndChats[index] = {
        ...currentContactsAndChats[index],
        lastReadMessageContactId: message.messageId,
      };
    }
    this.$contactsAndChats.next(currentContactsAndChats);
  }
}
