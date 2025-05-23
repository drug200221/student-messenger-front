import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ChatItemComponent } from '../chat-item/chat-item.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ChatService } from './chat.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { sortChatsByTime } from '../../../shared/utils/sortChatsByTime';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IChat } from './user-chats';
import { MessageInteractionService } from '../message-area/message-interaction.service';

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
    ReactiveFormsModule,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit, OnDestroy {
  public chats: IChat[] | null = null;
  public searchResult: IChat[] = [];
  public fb = inject(FormBuilder);
  public searchForm = this.fb.group({
    search: [''],
  });
  public isSearch = signal<boolean>(false);
  public chatService = inject(ChatService);
  private messageInteractionService = inject(MessageInteractionService);
  private subscriptions: Subscription[] = [];

  public ngOnInit() {
    this.subscriptions.push(
      this.chatService.$chats.subscribe(chats => {
        if (chats) {
          this.chats = sortChatsByTime(chats);
        } else {
          this.chatService.getChats().subscribe();
        }
      })
    );
    this.subscriptions.push(
      this.searchForm.controls.search.valueChanges.pipe(
        debounceTime(700),
        distinctUntilChanged()
      ).subscribe(value => {
        if (value && value.trim() !== '') {
          this.chatService.search(value).subscribe(
            result => {
              this.searchResult = result;
            }
          );
        } else {
          const chats = this.chatService.$chats.value ?? [];
          chats.filter(ch => ch.id <= 0);
          this.chatService.$chats.next(chats.filter(ch => ch.id > 0));

          this.searchResult = [];
        }
      })
    );
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onClickChat(chat: IChat) {
    this.chatService.setActive(chat.id);

    if (chat.id <= 0) {
      const chats = this.chatService.$chats.value ?? [];
      chats.push(chat);

      this.chatService.$chats.next(chats);
    }

    setTimeout(() => {
      this.messageInteractionService.triggerScrollToFirstUnread();
    }, 0);
  }

  protected resetSearch() {
    const chats = this.chatService.$chats.value ?? [];
    this.chatService.$chats.next(chats.filter(ch => ch.id > 0));

    this.isSearch.set(false);
    this.searchForm.controls.search.setValue('');
    this.searchResult = [];
  }
}
