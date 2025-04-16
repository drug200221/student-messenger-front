import { Routes } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { MessageAreaComponent } from './user/components/message-area/message-area.component';

export const routes: Routes = [
  {
    path: 'chats',
    component: SidenavComponent,
    children: [
      { path: ':chatId', component: MessageAreaComponent },
      { path: '', component: MessageAreaComponent },
    ],
  },
];
