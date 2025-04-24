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
import { Chat, Contact } from './user-chats-and-contacts';

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
  public chats: Chat[] = [];
  public contacts: Contact[] = [];
  protected activeChat?: number;
  private sidenavService = inject(SidenavService);
  private chatsService = inject(ChatsService);
  private router = inject(Router);

  public ngOnInit() {
    console.log(1);
    this.chatsService.getChatsAndContacts().subscribe(
      user => {
        this.contacts = user!.contacts;
        this.chats = user!.chats;
      }
    );
  }

  public setActive(chatId: number) {
    if (window.innerWidth <= 600) {
      this.sidenavService.isSidenavOpened = signal(false);
    }
    this.activeChat = chatId;
    this.chatsService.isActiveChat = signal(true);
    this.router.navigate(['/chats', this.activeChat]);
  }
}
