import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../core/interfaces/api-response';
import { env } from '../../../../env/env';
import { IChat, IMessage, IUser } from './user-chats';
import { SidenavService } from '../../../shared/sidenav/sidenav.service';
import { UserService } from '../../services/user.service';
import { sortChatsByTime } from '../../../shared/utils/sortChatsByTime';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public isActiveChatId = signal(-1);
  public $chats = new BehaviorSubject<IChat[] | null>(null);
  private sidenavService = inject(SidenavService);
  private userService = inject(UserService);
  private http = inject(HttpClient);

  public search(text: string) {
    return this.http.get<IApiResponse<IUser[]>>(`${env.baseApiUrl}?search=${text}`).pipe(
      map(response => {
        if (response.result) {
          const currUser = this.userService.$user.value!;
          const users = response.result;
          const chats: IChat[] = [];

          users.forEach(user => {
            const ch: IChat = {
              id: -user.id,
              userId: currUser.id,
              title: user.fullName,
              description: null,
              color: user.color,
              lastMessageId: 0,
              lastReadMessageId: 0,
              isPrivate: true,
              isArchived: false,
              isNotify: true,
              participants: [
                {
                  id: user.id,
                  chatId: 0,
                  fullName: user.fullName,
                  lastReadMessageId: 0,
                },
              ],
              messages: [],
              newMessagesCount: 0,
              isShowLoadMoreBtn: false,
            };

            if (ch.participants[0].id !== currUser.id) {
              const participant2 = {
                id: this.userService.$user.value!.id,
                chatId: 1,
                fullName: this.userService.$user.value!.fullName,
                lastReadMessageId: 0,
              };
              ch.participants.push(participant2);
            }

            if (this.$chats.value && this.$chats.value.length > 0) {
              let chatFound = false;

              for (const chat of this.$chats.value) {
                if (chat.isPrivate) {
                  const existingParticipantIds = chat.participants.map(p => p.id).sort();
                  const newParticipantIds = ch.participants.map(p => p.id).sort();

                  const participantsMatch =
                    existingParticipantIds.length === newParticipantIds.length &&
                    existingParticipantIds.every((id, index) => id === newParticipantIds[index]);

                  if (participantsMatch) {
                    chats.push(chat);
                    chatFound = true;
                    break;
                  }
                }
              }

              if (!chatFound) {
                chats.push(ch);
              }
            } else {
              chats.push(ch);
            }
          });

          return chats;
        }
        return [];
      })
    );
  }

  public getChats() {
    return this.http.get<IApiResponse<IUser>>(`${env.baseApiUrl}`).pipe(
      tap((response) => {
        if (response.result) {
          this.userService.$user.next(response.result);
          this.$chats.next(sortChatsByTime(response.result.chats));
        }
        if (response.error) {
          if (response.error.code === 403) {
            window.alert('Авторизуйтесь http://localhost:8080/student'); // FIXME: заменить ссылку или переделать
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

  public addMessage(recipientId: number, message: IMessage): void {
    const chats = this.$chats.getValue() ?? [];
    const index = chats.findIndex(c => c.id === message.chatId);

    if (index !== -1) {
      chats[index].messages.push(message);
      chats[index].lastMessageId = message.id;

      if (recipientId !== +message.sender.id) {
        chats[index].newMessagesCount++;
      }

      this.$chats.next(chats);
    } else {
      this.getChats().subscribe();
    }
  }

  public setActive(cId: number) {
    if (window.innerWidth <= 600) {
      this.sidenavService.isSidenavOpened = signal(false);
    }

    this.isActiveChatId = signal(cId);
  }

  public readMessages(message: IMessage) {
    const chats = this.$chats.getValue()!;

    const index = chats.findIndex(c => c.id === message.chatId);

    if (index !== -1) {
      chats[index] = {
        ...chats[index],
        lastReadMessageId: message.id,
      };
    }
    this.$chats.next(chats);
  }
}
