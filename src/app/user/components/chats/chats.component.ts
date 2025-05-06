import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatItemComponent } from '../chat-item/chat-item.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ChatService } from './chat.service';
import { CombinedContactsAndChats } from './combine-and-sort.messages';
import { Subscription } from 'rxjs';
import { sortContactsAndChats } from '../../../shared/utils/sortContactsAndChats';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'psk-chats',
  imports: [
    ChatItemComponent,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatIcon,
    MatInput,
    MatFormField,
    MatSuffix,
    MatListItem,
    MatFabButton,
    MatTooltip,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatNavList,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit, OnDestroy {
  public contactsAndChats: CombinedContactsAndChats[] = [];
  protected chatsService = inject(ChatService);
  private subscription: Subscription = new Subscription();

  public ngOnInit() {
    this.subscription.add(
      this.chatsService.$contactsAndChats.subscribe(contactsAndChats => {
        if (contactsAndChats.length > 0) {
          this.contactsAndChats = sortContactsAndChats(contactsAndChats);
        } else {
          this.chatsService.getChatsAndContacts().subscribe(loadedContactsAndChats =>
            this.contactsAndChats = loadedContactsAndChats);
        }
      })
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
