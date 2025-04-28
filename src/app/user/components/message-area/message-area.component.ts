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
import { of, switchMap, take } from 'rxjs';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { getLetters } from '../../../shared/utils/getLetters';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MessageService } from './message.service';
import { HttpParams } from '@angular/common/http';
import { ChatMessage, ContactMessage } from '../chats/user-chats-and-contacts';
import { getDateLabel } from '../../../shared/utils/getDateLabel';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContactMessageRequest } from './contact-message_request';

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
    FormsModule,
    ReactiveFormsModule,

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
  private fb = inject(FormBuilder);
  private cId = this.router.url.split('/')[2];
  public messageForm = this.fb.group({
    text: ['', Validators.required],
    senderId: [this.cId, Validators.required],
    replyMessageId: [null],
    fileId: [null],
  });

  public ngOnInit() {
    const type = this.router.url.split('/')[1].slice(0, -1);

    this.chatsService.$contactsAndChats.pipe(
      switchMap(contactsAndChats =>
        of(contactsAndChats.find(c => c.type === type && c.id === +this.cId))
      )
    ).subscribe(c => {
      this.c = c;
      if (this.c) {
        const params = new HttpParams().set(this.c.type === 'contact' ? 'contactId' : 'chatId', this.cId);
        this.messageService.getMessages(params).pipe(take(1)).subscribe(
          cMessages => this.messages = cMessages
        );
      }
    });
  }

  protected send() {
    const request: IContactMessageRequest = {
      senderId: +this.cId,
      text: this.messageForm.value.text as string,
      replyMessageId: this.messageForm.value.replyMessageId as number | undefined,
      fileId: this.messageForm.value.replyMessageId as number | undefined,
    };
    this.messageService.send(request).subscribe();
  }

  protected shouldDisplayDate($index: number, messages: ContactMessage[] | ChatMessage[]) {
    if ($index === 0) {
      return true;
    }

    const currentDate = new Date(messages[$index].date.date).setHours(0, 0, 0, 0);
    const prevDate = new Date(messages[$index - 1].date.date).setHours(0, 0, 0, 0);
    return currentDate > prevDate;
  }

  protected goBack() {
    this.sidenavService.toggleSidenav();
    if (window.innerWidth <= 600) {
      this.chatsService.isActiveChat = signal(false);
      this.router.navigate(['../']);
    }
  }
}
