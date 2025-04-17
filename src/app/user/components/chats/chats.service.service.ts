import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatsServiceService {
  public isActiveChat = signal(false);
}
