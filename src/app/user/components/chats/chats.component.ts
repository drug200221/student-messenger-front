import { Component, inject, OnInit } from '@angular/core';
import { ChatItemComponent } from '../chat-item/chat-item.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatSelectionList } from '@angular/material/list';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';

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
    MatSelectionList,
    MatListItem,
    MatFabButton,
    MatTooltip,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {

  public items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private route = inject(ActivatedRoute);
  public chatId: number = +this.route.snapshot.params['chatId'];

  public ngOnInit(): void {
    this.route.params.subscribe(params => console.log(params));
    console.log(this.chatId);
  }
}
