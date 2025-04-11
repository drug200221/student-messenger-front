import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  public sidenavOpen = signal(true);

  public toggleSidenav() {
    this.sidenavOpen.set(!this.sidenavOpen());
  }

  public getChats(userId: number) {
    return userId;
  }
}
