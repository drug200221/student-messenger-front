import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardFooter, MatCardTitle } from '@angular/material/card';
import { SidenavService } from '../../../shared/sidenav/sidenav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../chats/chat.service';
import { Subscription, tap } from 'rxjs';
import { getLetters } from '../../../shared/utils/getLetters';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MessageService } from './message.service';
import { IContactOrChatMessage } from '../chats/user-chats-and-contacts';
import { getDateLabel } from '../../../shared/utils/getDateLabel';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMessageRequest } from './contact-message_request';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { UserService } from '../../services/user.service';
import { MessageInteractionService } from './message-interaction.service';
import { IReadMessageRequest } from './read-message_request';

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
    MatCardTitle,
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
export class MessageAreaComponent implements OnInit, OnDestroy {
  @ViewChild('messageDisplay') public messageDisplayRef!: ElementRef;
  protected readonly getLetters = getLetters;
  protected readonly getDateLabel = getDateLabel;
  protected sidenavService = inject(SidenavService);
  protected c: CombinedContactsAndChats | undefined;
  protected chatsService = inject(ChatService);
  protected userService = inject(UserService);
  private messageService = inject(MessageService);
  private messageInteractionService = inject(MessageInteractionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public contactMessageForm = this.fb.group({
    text: [''],
    recipientId: [-1, Validators.required],
    replyMessageId: [null],
    fileId: [null],
  });
  public chatMessageForm = this.fb.group({
    text: [''],
    chatId: [-1, Validators.required],
    replyMessageId: [null],
    fileId: [null],
  });
  private subscriptions: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
  }

  public ngOnInit() {
    this.subscriptions.push(
      this.messageInteractionService.$scrollToFirstUnreadSubject.subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.cdr.detectChanges();
            this.scrollToFirstUnread();
          }, 50);
        });
      })
    );
    this.subscriptions.push(
      this.route.paramMap.pipe(
        tap((params) => {
          const type = this.router.url.split('/')[1].slice(0, -1);
          let cId = -1;
          if (params.has('chatId')) {
            cId = +(params.get('chatId')!);
            this.chatMessageForm.controls.chatId.setValue(+cId);
            this.contactMessageForm.controls.recipientId.setValue(-1);
          } else if (params.has('contactId')) {
            cId = +(params.get('contactId')!);
            this.contactMessageForm.controls.recipientId.setValue(+cId);
            this.chatMessageForm.controls.chatId.setValue(-1);
          }
          this.subscriptions.push(
            this.chatsService.$contactsAndChats.subscribe(
              cs => {
                if (cs) {
                  if (cs[cs.length - 1].id !== this.userService.$user.value?.id || cs[cs.length - 1].newMessages === 0) {
                    this.scrollToBottom();
                  }
                  this.c = cs.find(c => c.id === cId && c.type === type);
                }
              })
          );
          if (!this.c) {
            const c = this.messageService.$newContact.value;
            if (c) {
              this.c = {
                id: c.id,
                fullName: c.fullName,
                color: c.color,
                lastReadMessageUserId: 0,
                lastReadMessageContactId: 0,
                isArchived: false,
                notify: true,
                messages: [],
                newMessages: 0,
                type: 'contact',
              };
            } else {
              this.router.navigate(['/']);
            }
          }
        })
      ).subscribe());
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public updateLastReadMessageId() {
    if (!this.c) {
      return;
    }

    let maxMessageId = this.c.lastReadMessageUserId;
    const messageDisplayEl = this.messageDisplayRef.nativeElement as HTMLElement;

    const messages = messageDisplayEl.querySelectorAll<HTMLElement>('.recipient mat-card.unread');
    console.log(messages);
    messages.forEach(msg => {
      const rect = msg.getBoundingClientRect();
      const containerRect = messageDisplayEl.getBoundingClientRect();

      if (rect.bottom > containerRect.top && rect.top < containerRect.bottom) {
        const messageId = parseInt(msg.id, 10);
        if (messageId > maxMessageId) {
          maxMessageId = messageId;
        }
      }
    });

    if (maxMessageId > this.c.lastReadMessageUserId) {
      this.c.lastReadMessageUserId = maxMessageId;
      const request: IReadMessageRequest = {
        type: this.c.type,
        lastReadMessageUserId: this.c.lastReadMessageUserId,
        lastReadMessageContactId: this.c.lastReadMessageContactId,
      };

      this.messageService.read(this.c, request).subscribe();
    }
  }

  public scrollToFirstUnread() {
    if (!this.messageDisplayRef) {
      return;
    }

    const messageDisplayEl = this.messageDisplayRef.nativeElement as HTMLElement;
    const firstUnread = messageDisplayEl.querySelector('.recipient mat-card.unread');

    if (firstUnread) {
      firstUnread.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.scrollToBottom();
    }
  }

  public scrollToBottom() {
    if (this.messageDisplayRef) {
      setTimeout(() => {
        const element = this.messageDisplayRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 0);
    }
  }

  protected sendInContact() {
    if (this.contactMessageForm && this.contactMessageForm.valid && this.contactMessageForm.controls['text'].value) {
      const request: IMessageRequest = {
        recipientId: this.contactMessageForm.value.recipientId as number,
        text: this.contactMessageForm.value.text as string,
        replyMessageId: this.contactMessageForm.value.replyMessageId as number | undefined,
        fileId: this.contactMessageForm.value.replyMessageId as number | undefined,
      };
      if (this.messageService.$newContact.value !== null) {
        const contacts = [...this.chatsService.$contactsAndChats.value!];
        contacts.push(this.c!);
        this.chatsService.$contactsAndChats.next(contacts);
        this.messageService.$newContact.next(null);
      }
      this.messageService.send(request).subscribe({
        next: () => {
          this.contactMessageForm!.reset({
            recipientId: +this.c!.id,
            replyMessageId: null,
            fileId: null,
          });
          this.scrollToBottom();
        },
      });
    }
  }

  protected sendInChat() {
    if (this.chatMessageForm && this.chatMessageForm.valid && this.chatMessageForm.controls['text'].value) {
      const request: IMessageRequest = {
        chatId: this.chatMessageForm.value.chatId as number,
        text: this.chatMessageForm.value.text as string,
        replyMessageId: this.chatMessageForm.value.replyMessageId as number | undefined,
        fileId: this.chatMessageForm.value.replyMessageId as number | undefined,
      };
      this.messageService.send(request).subscribe({
        next: () => {
          this.chatMessageForm!.reset({
            chatId: +this.c!.id,
            replyMessageId: null,
            fileId: null,
          });
          this.scrollToBottom();
        },
      });
    }
  }

  protected shouldDisplayDate($index: number, messages: IContactOrChatMessage[]) {
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
      this.chatsService.isActiveChatId = signal(-1);
      this.chatsService.isActiveContactId = signal(-1);
      this.router.navigate(['../']);
    }
  }
}
