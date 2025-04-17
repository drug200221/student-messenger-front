import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from '../../mocks/interfaces/chat';
import { mockChats } from '../../mocks/models/mock.chats';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  public isActiveChat = signal(false);
  public $chats = new BehaviorSubject<Chat[]>([]);

  public getChats(): Observable<Chat[]> {
    this.$chats.next(mockChats);
    return this.$chats;
  }
}
