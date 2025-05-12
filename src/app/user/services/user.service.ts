import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../components/chats/user-chats-and-contacts';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public $user = new BehaviorSubject<IUser | null>(null);
}
