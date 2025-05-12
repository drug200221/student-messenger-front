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
import { CombinedContactsAndChats } from './combine-and-sort.messages';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { sortContactsAndChats } from '../../../shared/utils/sortContactsAndChats';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IUser } from './user-chats-and-contacts';
import { MessageService } from '../message-area/message.service';

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
  public contactsAndChats: CombinedContactsAndChats[] | null = null;
  public searchResult: IUser[] | null = null;
  public fb = inject(FormBuilder);
  public searchForm = this.fb.group({
    search: [''],
  });
  public isShowSearch = signal<boolean>(false);
  protected chatsService = inject(ChatService);
  protected messageService = inject(MessageService);
  private subscriptions: Subscription[] = [];

  public ngOnInit() {
    this.subscriptions.push(
      this.chatsService.$contactsAndChats.subscribe(contactsAndChats => {
        if (contactsAndChats) {
          this.contactsAndChats = sortContactsAndChats(contactsAndChats);
        } else {
          this.chatsService.getChatsAndContacts().subscribe();
        }
      })
    );
    this.subscriptions.push(
      this.searchForm.controls.search.valueChanges.pipe(
        debounceTime(700),
        distinctUntilChanged()
      ).subscribe(value => {
        if (value && value.trim() !== '') {
          this.chatsService.search(value).subscribe(
            result => this.searchResult = result
          );
        } else {
          this.searchResult = [];
        }
      })
    );
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  protected resetSearch() {
    this.isShowSearch.set(false);
    this.searchForm.controls.search.setValue('');
    this.searchResult = null;
  }
}
