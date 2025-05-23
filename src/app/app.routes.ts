import { Routes } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { MessageAreaComponent } from './user/components/message-area/message-area.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: 'chats/:chatId', component: MessageAreaComponent },
      { path: '**' },
    ],
  },

];
