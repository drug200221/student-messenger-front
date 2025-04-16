import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  public isSidenavOpened = signal(true);

  public toggleSidenav() {
    this.isSidenavOpened.set(!this.isSidenavOpened());
  }

  public getChats(userId: number) {
    return userId;
  }
}
