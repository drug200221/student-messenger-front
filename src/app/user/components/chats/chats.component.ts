import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatItemComponent } from '../chat-item/chat-item.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { ChatsService } from './chats.service';
import { Router } from '@angular/router';
import { SidenavService } from '../../../shared/sidenav/sidenav.service';
import { CombinedContactsAndChats } from './combine-and-sort.messages';

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
    NgClass,
    MatNavList,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {
  public contactsAndChats: CombinedContactsAndChats[] = [];
  protected activeC?: number;
  protected chatsService = inject(ChatsService);
  private sidenavService = inject(SidenavService);
  private router = inject(Router);

  public ngOnInit() {
    this.chatsService.getChatsAndContacts().subscribe(
      contactsAndChats => this.contactsAndChats = contactsAndChats
    );
  }

  public setActive(c: CombinedContactsAndChats) {
    if (window.innerWidth <= 600) {
      this.sidenavService.isSidenavOpened = signal(false);
    }
    this.activeC = c.id;
    this.chatsService.isActiveChat = signal(true);
    if (c.type === 'contact') {
      this.router.navigate(['/contacts', this.activeC]);
    } else if (c.type === 'chat') {
      this.router.navigate(['/chats', this.activeC]);
    }
  }
}
