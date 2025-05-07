import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { NgClass } from '@angular/common';
import { getLetters } from '../../../shared/utils/getLetters';
import { getDateMessage } from '../../../shared/utils/getDateMessage';
import { ChatService } from '../chats/chat.service';
import { MatBadge } from '@angular/material/badge';

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
  @Input() public c!: CombinedContactsAndChats;
  protected readonly getLetters = getLetters;
  protected readonly getDateMessage = getDateMessage;
  protected chatService = inject(ChatService);
}
