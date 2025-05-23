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
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
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
import { getDateLabel, shouldDisplayDate } from '../../../shared/utils/getDateLabel';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMessageRequest, IReadMessageRequest } from './message_request';
import { UserService } from '../../services/user.service';
import { MessageInteractionService } from './message-interaction.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadge } from '@angular/material/badge';
import { IChat } from '../chats/user-chats';
import { MAScrollService } from './m-a-scroll.service';

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
    MatProgressSpinnerModule,
    MatButton,
    MatFabButton,
    MatBadge,
  ],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.scss',
})
export class MessageAreaComponent implements OnInit, OnDestroy {
  @ViewChild('messageDisplay') public messageDisplayRef!: ElementRef;

  public isSending = false;
  protected readonly getLetters = getLetters;
  protected readonly getDateLabel = getDateLabel;
  protected readonly shouldDisplayDate = shouldDisplayDate;

  protected chat: IChat | undefined;
  protected sidenavService = inject(SidenavService);
  protected maScrollService = inject(MAScrollService);
  protected chatService = inject(ChatService);
  protected userService = inject(UserService);
  private messageService = inject(MessageService);
  private messageInteractionService = inject(MessageInteractionService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public chatMessageForm = this.fb.group({
    text: [''],
    chatId: [-1, Validators.required],
    replyMessageId: [null as number | null],
    fileId: [null as number | null],
    recipientId: [null as number | null],
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
            this.maScrollService.scrollToFirstUnread(this.messageDisplayRef);
            this.maScrollService.checkScroll(this.messageDisplayRef);
          }, 50);
        });
      })
    );

    this.subscriptions.push(
      this.route.paramMap.pipe(
        tap((params) => {
          let cId = -1;
          if (params.has('chatId')) {
            cId = +(params.get('chatId')!);
            this.chatMessageForm.controls.chatId.setValue(+cId);
          }
          this.subscriptions.push(
            this.chatService.$chats.subscribe(
              chats => {
                if (chats && chats.length > 0) {
                  if (chats[chats.length - 1].id !== this.userService.$user.value?.id || chats[chats.length - 1].newMessagesCount === 0) {
                    if (this.maScrollService.maybeScrollToBottom(this.messageDisplayRef)) {
                      this.maScrollService.scrollToBottom(this.messageDisplayRef);
                    }
                  }
                  this.chat = chats.find(c => c.id === cId);

                  if (this.chat && this.chat.isPrivate) {
                    this.chatMessageForm.controls.recipientId.setValue(this.chat.participants[0].id);
                  }
                }
              })
          );
        })
      ).subscribe());
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onMouseMove() {
    this.maScrollService.checkScroll(this.messageDisplayRef);
    if (!this.maScrollService.isScrollable()) {
      this.updateLastReadMessageId();
    }
  }

  public onScroll() {
    if (this.maScrollService.isScrollable()) {
      setTimeout(() => {
        this.updateLastReadMessageId();
      }, 600);
    }
  }

  public goBack() {
    this.sidenavService.toggleSidenav();

    if (window.innerWidth <= 600) {
      this.chatService.isActiveChatId = signal(-1);
      this.router.navigate(['../']);
    }
  }

  public onLoadMore(chat: IChat) {
    const container = this.messageDisplayRef.nativeElement;
    const prevScrollHeight = container.scrollHeight;

    this.messageService.getMessages(chat, chat.messages.length).subscribe(
      newMessages => {
        chat.messages.unshift(...newMessages);
        const offset = 30; // на бэкенде offset==30
        chat.isShowLoadMoreBtn = newMessages.length === offset;
      }
    );

    const chats = this.chatService.$chats.value!;
    const index = chats.findIndex(c => chat.id === c.id);

    setTimeout(() => {
      const scrollDifference = container.scrollHeight - prevScrollHeight;
      container.scrollTop = container.scrollTop + scrollDifference;
    }, 100);

    if (index !== 1) {
      chats[index] = chat;
      this.chatService.$chats.next(chats);
    }
  }

  public send() {
    if (this.chatMessageForm.valid && this.chatMessageForm.controls['text'].value) {
      const request: IMessageRequest = {
        chatId: this.chatMessageForm.value.chatId as number,
        text: this.chatMessageForm.value.text as string,
        isEdited: false,
        replyMessageId: this.chatMessageForm.value.replyMessageId as number | null,
        fileId: this.chatMessageForm.value.replyMessageId as number | null,
        recipientId: this.chatMessageForm.value.recipientId as number | null,
      };
      this.messageService.send(this.chat!, request).subscribe({
        next: () => {
          this.router.navigate(['chats', this.chat!.id]);

          this.chatMessageForm.reset({
            chatId: this.chat!.id,
            replyMessageId: null,
            fileId: null,
          });

          this.maScrollService.scrollToBottom(this.messageDisplayRef);
          this.applyCooldown();
        },
      });
    }
  }

  private applyCooldown() {
    this.isSending = true;
    setTimeout(() => {
      this.isSending = false;
    }, 1500);
  }

  private updateLastReadMessageId() {
    if (this.chat) {
      let maxMessageId = this.chat.lastReadMessageId;
      const messageDisplayEl = this.messageDisplayRef.nativeElement as HTMLElement;
      const messages = messageDisplayEl.querySelectorAll<HTMLElement>('.recipient mat-card.unread');

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

      if (maxMessageId >= this.chat.lastReadMessageId) {
        this.chat.lastReadMessageId = maxMessageId;

        const request: IReadMessageRequest = {
          action: 'read',
          lastReadMessageId: this.chat.lastReadMessageId,
        };

        this.messageService.read(this.chat, request).subscribe();
        this.chat!.newMessagesCount = 0;
      }
    }
  }
}
