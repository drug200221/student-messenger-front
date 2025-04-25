import { Component, inject, OnInit, signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { SidenavService } from '../../../shared/sidenav/sidenav.service';
import { Router } from '@angular/router';
import { ChatsService } from '../chats/chats.service';
import { of, switchMap } from 'rxjs';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { getLetters } from '../../../shared/utils/getLetters';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MessageService } from './message.service';
import { HttpParams } from '@angular/common/http';
import { ChatMessage, ContactMessage } from '../chats/user-chats-and-contacts';
import { getDateLabel } from '../../../shared/utils/getDateLabel';

@Component({
  selector: 'psk-message-area',
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatFormField,
    MatInput,
    MatSuffix,
    MatCard,
    MatCardContent,
    MatCardFooter,
    NgClass,
    NgIf,
    DatePipe,

  ],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.scss',
})
export class MessageAreaComponent implements OnInit {
  protected c: CombinedContactsAndChats | undefined;
  protected messages: ContactMessage[] | ChatMessage[] = [];
  protected sidenavService = inject(SidenavService);
  protected readonly getLetters = getLetters;
  protected readonly Date = Date;
  protected readonly getDateLabel = getDateLabel;
  private chatsService = inject(ChatsService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  public ngOnInit() {
    const type = this.router.url.split('/')[1].slice(0, -1);
    const cId = this.router.url.split('/')[2];
    this.chatsService.$contactsAndChats.pipe(
      switchMap(contactsAndChats =>
        of(contactsAndChats.find(c => c.type === type && c.id === +cId))
      )
    ).subscribe(c => this.c = c);

    if (this.c) {
      const params = new HttpParams().set(this.c.type === 'contact' ? 'contactId' : 'chatId', cId);
      this.messageService.getMessages(params).pipe().subscribe(
        cMessages => {
          this.messages = cMessages;
          console.log(cMessages);
        }
      );
    }
  }

  protected goBack() {
    this.sidenavService.toggleSidenav();
    if (window.innerWidth <= 600) {
      this.chatsService.isActiveChat = signal(false);
      this.router.navigate(['../']);
    }
  }
}
