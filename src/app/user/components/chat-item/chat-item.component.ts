import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { getLetters } from '../../../shared/utils/getLetters';
import { getDateMessage } from '../../../shared/utils/getDateMessage';
import { MatBadge } from '@angular/material/badge';
import { IChat } from '../chats/user-chats';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'psk-chat-item',
  imports: [
    MatIcon,
    NgClass,
    MatBadge,
  ],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.scss',
})
export class ChatItemComponent {
  @Input() public chat!: IChat;
  protected readonly getLetters = getLetters;
  protected readonly getDateMessage = getDateMessage;
  protected userService = inject(UserService);

  public getPrivateChatRecipientId() {
    if (this.chat.isPrivate) {
      const participants = this.chat.participants;
      let id;

      if (participants.length == 1) {
        id = participants[0].id;
      } else {
        id = this.chat.participants.filter(p => p.id !== this.userService.$user.value?.id)[0].id;
      }
      
      return 'id:' + id + ' ';
    }
    return '';
  }
}
