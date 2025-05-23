import { ElementRef, HostListener, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MAScrollService {
  public shouldScrollToBottom = signal(false);
  public isScrollable = signal(false);
  private previousScrollTop = 0;

  @HostListener('window:resize', ['$event'])
  public checkScroll(messageDisplayRef: ElementRef<HTMLElement>) {
    const el = messageDisplayRef.nativeElement;
    this.isScrollable = signal(el.scrollHeight > el.clientHeight);
  }

  public scrollDownOnClick(messageDisplayRef: ElementRef<HTMLElement>) {
    const element = messageDisplayRef.nativeElement;

    const currentScrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const isAtBottom = (scrollHeight - currentScrollTop - clientHeight) < 1;

    const scrolledUp = currentScrollTop < this.previousScrollTop;

    if (this.shouldScrollToBottom() && isAtBottom) {
      this.scrollToBottom(messageDisplayRef);
    } else {
      this.scrollToFirstUnread(messageDisplayRef);
      this.shouldScrollToBottom.set(true);
    }

    if (scrolledUp) {
      this.shouldScrollToBottom.set(false);
    } else {
    }

    this.previousScrollTop = currentScrollTop;
  }

  public scrollToFirstUnread(messageDisplayRef: ElementRef<HTMLElement>) {
    if (!messageDisplayRef) {
      return;
    }

    const messageDisplayEl = messageDisplayRef.nativeElement;
    const firstUnread = messageDisplayEl.querySelector('.recipient mat-card.unread');

    if (firstUnread) {
      firstUnread.scrollIntoView({ behavior: 'instant', block: 'end' });
    } else {
      this.scrollToBottom(messageDisplayRef);
    }
  }

  public maybeScrollToBottom(messageDisplayRef: ElementRef<HTMLElement>) {
    if (!messageDisplayRef) {
      return;
    }

    const container = messageDisplayRef.nativeElement;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    const thresholdPx = 300; // порог в пикселях

    return scrollHeight - (scrollTop + clientHeight) < thresholdPx;
  }

  public scrollToBottom(messageDisplayRef: ElementRef<HTMLElement>) {
    if (messageDisplayRef) {
      setTimeout(() => {
        const element = messageDisplayRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 50);
    }
  }
}
