import { Component, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';
import { RouterOutlet } from '@angular/router';
import { ChatsComponent } from '../../user/components/chats/chats.component';
import { ChatsService } from '../../user/components/chats/chats.service';

@Component({
  selector: 'psk-sidenav',
  imports: [
    RouterOutlet,
    ChatsComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  protected sidenavService = inject(SidenavService);
  private chatsService = inject(ChatsService);

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    const target = event.target as Window;
    if (target.innerWidth > 920) {
      this.sidenavService.isSidenavOpened = signal(true);
    } else if (this.sidenavService.isSidenavOpened()) {
      if (target.innerWidth <= 920) {
        if (target.innerWidth <= 600 && this.chatsService.isActiveChat()) {
          this.sidenavService.isSidenavOpened = signal(false);
        } else {
          this.sidenavService.isSidenavOpened = signal(true);
        }
      }
    }
  }

  public ngOnInit(): void {
    return;
  }

  public ngOnDestroy(): void {
    return;
  }
}
