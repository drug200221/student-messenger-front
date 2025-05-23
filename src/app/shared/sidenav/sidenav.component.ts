import { Component, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';
import { RouterOutlet } from '@angular/router';
import { ChatsComponent } from '../../user/components/chats/chats.component';
import { ChatService } from '../../user/components/chats/chat.service';
import { UserService } from '../../user/services/user.service';
import { SocketService } from '../../user/services/socket.service';
import { Subscription } from 'rxjs';

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
  public sidenavService = inject(SidenavService);
  private userService = inject(UserService);
  private socketService = inject(SocketService);
  private chatsService = inject(ChatService);

  private subscription = new Subscription();

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    const target = event.target as Window;
    if (target.innerWidth > 920) {
      this.sidenavService.isSidenavOpened = signal(true);
    } else if (this.sidenavService.isSidenavOpened()) {
      if (target.innerWidth <= 920) {
        if (target.innerWidth <= 600) {
          if (this.chatsService.isActiveChatId() === -1) {
            this.sidenavService.isSidenavOpened = signal(true);
          } else {
            this.sidenavService.isSidenavOpened = signal(false);
          }
        } else {
          this.sidenavService.isSidenavOpened = signal(true);
        }
      }
    }
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.userService.$user.subscribe(
        user => {
          if (user) {
            this.socketService.connect(user.id.toString());
          }
        }
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.socketService.disconnect();
  }
}
