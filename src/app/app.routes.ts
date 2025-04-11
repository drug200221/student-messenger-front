import { Routes } from '@angular/router';
import { IndexComponent } from './user/pages/index/index.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: 'A', component: IndexComponent },
    ],
  },
];
