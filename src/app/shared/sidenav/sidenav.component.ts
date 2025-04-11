import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';
import { RouterOutlet } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { ChatsComponent } from '../../user/components/chats/chats.component';

@Component({
  selector: 'psk-sidenav',
  imports: [
    MatSidenav,
    MatSidenavContent,
    MatSidenavContainer,
    RouterOutlet,
    MatNavList,
    ChatsComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  protected sidenavService = inject(SidenavService);

  public ngOnInit(): void {
    return;
  }

  public ngOnDestroy(): void {
    return;
  }
}
