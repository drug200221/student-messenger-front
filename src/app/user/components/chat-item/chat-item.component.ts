import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Chat } from '../../mocks/interfaces/chat';

@Component({
  selector: 'psk-chat-item',
  imports: [
    MatIcon,
  ],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.scss',
})
export class ChatItemComponent {
  @Input() public chat!: Chat;

  protected getDateMessage(date: Date): string {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();

    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    const currentYear = now.getFullYear();
    const year = date.getFullYear();

    if (minutesDiff < 1) {
      return 'Только что';
    } else if (minutesDiff < 60) {
      return `${minutesDiff} минут назад`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} часов назад`;
    } else if (daysDiff === 1) {
      return 'Вчера';
    } else if (daysDiff < 30) {
      return `${daysDiff} день назад`;
    } else {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
      const monthDay = date.toLocaleDateString('ru-RU', options);

      if (year !== currentYear) {
        return `${monthDay} ${year}`;
      } else {
        return monthDay;
      }
    }
  }

  protected getLetters(title: string) {
    const letters = title.split(' ');
    if (letters.length === 1) {
      return letters[0].substring(0, 2).toUpperCase();
    } else {
      const l = letters.slice(0, 2).map(letter =>
        letter.charAt(0).toUpperCase());
      return l.join('');
    }
  }
}
