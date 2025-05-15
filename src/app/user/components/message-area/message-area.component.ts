import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
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
import { getDateLabel } from '../../../shared/utils/getDateLabel';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMessageRequest } from './contact-message_request';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { UserService } from '../../services/user.service';
import { MessageInteractionService } from './message-interaction.service';
import { IReadMessageRequest } from './read-message_request';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { shouldDisplayDate } from '../../../shared/utils/shouldDisplayDate';
import { MatBadge } from '@angular/material/badge';

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
  public scrollBottom = false;
  protected readonly getLetters = getLetters;
  protected readonly getDateLabel = getDateLabel;
  protected sidenavService = inject(SidenavService);
  protected c: CombinedContactsAndChats | undefined;
  protected chatsService = inject(ChatService);
  protected userService = inject(UserService);
  protected readonly shouldDisplayDate = shouldDisplayDate;
  private isScrollable = false;
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
            this.checkScroll();
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
                    if (this.maybeScrollToBottom()) {
                      this.scrollToBottom();
                    }
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
                isShowLoadMoreBtn: false,
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

  @HostListener('window:resize', ['$event'])
  public checkScroll() {
    const el = this.messageDisplayRef.nativeElement;
    this.isScrollable = el.scrollHeight > el.clientHeight;
  }

  public onMouseMove() {
    if (!this.isScrollable) {
      this.updateLastReadMessageId();
    }
  }

  public onScroll() {
    if (this.isScrollable) {
      setTimeout(() => {
        this.updateLastReadMessageId();
      }, 600);
    }
  }

  public scrollToFirstUnread() {
    if (!this.messageDisplayRef) {
      return;
    }

    const messageDisplayEl = this.messageDisplayRef.nativeElement as HTMLElement;
    const firstUnread = messageDisplayEl.querySelector('.recipient mat-card.unread');

    if (firstUnread) {
      firstUnread.scrollIntoView({ behavior: 'instant', block: 'end' });
    } else {
      this.scrollToBottom();
    }
  }

  public maybeScrollToBottom() {
    if (!this.messageDisplayRef) {
      return;
    }

    const container = this.messageDisplayRef.nativeElement as HTMLElement;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    const thresholdPx = 300; // порог в пикселях

    return scrollHeight - (scrollTop + clientHeight) < thresholdPx;
  }

  public scrollToBottom() {
    if (this.messageDisplayRef) {
      setTimeout(() => {
        const element = this.messageDisplayRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 0);
    }
  }

  public goBack() {
    this.sidenavService.toggleSidenav();

    if (window.innerWidth <= 600) {
      this.chatsService.isActiveChatId = signal(-1);
      this.chatsService.isActiveContactId = signal(-1);
      this.router.navigate(['../']);
    }
  }

  public onLoadMore(c: CombinedContactsAndChats) {
    const container = this.messageDisplayRef.nativeElement;
    const prevScrollHeight = container.scrollHeight;

    this.messageService.getMessages(c, c.messages.length).subscribe(
      newMessages => {
        c.messages.unshift(...newMessages);
        const offset = 30; // на бэкенде offset==30
        c.isShowLoadMoreBtn = newMessages.length === offset;
      }
    );

    const contactsAndChats = this.chatsService.$contactsAndChats.value!;
    const index = contactsAndChats.findIndex(cc => c.id === cc.id && c.type === 'contact');

    setTimeout(() => {
      console.log(container.scrollTop);
      console.log(container.scrollHeight);
      console.log(container.prevScrollHeight);
      const scrollDifference = container.scrollHeight - prevScrollHeight;
      container.scrollTop = container.scrollTop + scrollDifference;
    }, 100);

    if (index !== 1) {
      contactsAndChats[index] = c;
      this.chatsService.$contactsAndChats.next(contactsAndChats);
    }
  }

  public sendInContact() {
    if (this.contactMessageForm && this.contactMessageForm.valid &&
      this.contactMessageForm.controls['text'].value) {
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

          this.applyCooldown();
        },
      });
    }
  }

  public sendInChat() {
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
    if (!this.c) {
      return;
    }

    let maxMessageId = this.c.lastReadMessageUserId;
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

    if (maxMessageId > this.c.lastReadMessageUserId) {
      this.c.lastReadMessageUserId = maxMessageId;
      const request: IReadMessageRequest = {
        type: this.c.type,
        lastReadMessageUserId: this.c.lastReadMessageUserId,
      };

      this.messageService.read(this.c, request).subscribe();
    }
  }
}
