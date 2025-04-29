import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { getLetters } from '../../../shared/utils/getLetters';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MessageService } from './message.service';
import { HttpParams } from '@angular/common/http';
import { ContactOrChatMessage } from '../chats/user-chats-and-contacts';
import { getDateLabel } from '../../../shared/utils/getDateLabel';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContactMessageRequest } from './contact-message_request';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { SocketService } from '../../services/socket.service';

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
  @ViewChild('messageDisplay') public messageDisplay!: ElementRef;
  protected c: CombinedContactsAndChats | undefined;
  protected messages: ContactOrChatMessage[] = [];
  protected sidenavService = inject(SidenavService);
  protected readonly getLetters = getLetters;
  protected readonly getDateLabel = getDateLabel;
  private chatsService = inject(ChatsService);
  private messageService = inject(MessageService);
  private socketService = inject(SocketService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private type = this.router.url.split('/')[1].slice(0, -1);
  private cId = this.router.url.split('/')[2];
  public messageForm = this.fb.group({
    text: [''],
    recipientId: [this.cId, Validators.required],
    replyMessageId: [null],
    fileId: [null],
  });

  public ngOnInit() {
    this.socketService.getMessages().subscribe((message: unknown) => {
      this.messages.push((message as ContactOrChatMessage));
      console.log(message);
    });
    this.chatsService.$contactsAndChats.pipe(
      switchMap(contactsAndChats =>
        of(contactsAndChats.find(c => c.type === this.type && c.id === +this.cId))
      )
    ).subscribe(
      c => {
        if (c) {
          this.c = c;
          const params = new HttpParams().set(c.type === 'contact' ? 'contactId' : 'chatId', this.cId);
          this.messageService.getMessages(params).subscribe(
            messages => {
              this.messages = messages;
              this.scrollToBottom();
            }
          );
        }
      }
    );
  }

  public scrollToBottom() {
    if (this.messageDisplay) {
      setTimeout(() => {
        const element = this.messageDisplay.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 20);
    }
  }

  protected send() {
    if (this.messageForm.valid && this.messageForm.controls.text.value) {
      const request: IContactMessageRequest = {
        recipientId: +this.cId,
        text: this.messageForm.value.text as string,
        replyMessageId: this.messageForm.value.replyMessageId as number | undefined,
        fileId: this.messageForm.value.replyMessageId as number | undefined,
      };
      this.messageService.send(request).subscribe({
        next: () => {
          this.messageForm.reset({
            recipientId: this.cId,
            replyMessageId: null,
            fileId: null,
          });
          this.scrollToBottom();
        },
      });
    }
  }

  protected shouldDisplayDate($index: number, messages: ContactOrChatMessage[]) {
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
