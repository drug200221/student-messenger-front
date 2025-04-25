import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DateTime } from '../chats/user-chats-and-contacts';
import { CombinedContactsAndChats } from '../chats/combine-and-sort.messages';
import { NgClass } from '@angular/common';
import { getLetters } from '../../../shared/utils/getLetters';

@Component({
  selector: 'psk-chat-item',
  imports: [
    MatIcon,
    NgClass,
  ],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.scss',
})
export class ChatItemComponent {
  @Input() public c!: CombinedContactsAndChats;
  protected readonly getLetters = getLetters;

  protected getDateMessage(dateTime: DateTime): string {
    const localDateTime = new Date(dateTime.date + `GMT+${dateTime.timezone_type}`);
    const now = new Date();
    const timeDiff = now.getTime() - localDateTime.getTime();

    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    const currentYear = now.getFullYear();
    const year = localDateTime.getFullYear();

    if (minutesDiff < 1) {
      return 'Только что';
    } else if (minutesDiff < 60) {
      if (minutesDiff % 10 === 1 && minutesDiff % 100 !== 11) {
        return `${minutesDiff} минуту назад`;
      } else if ([2, 3, 4].includes(minutesDiff % 10) && !(minutesDiff % 100 >= 12 && minutesDiff % 100 <= 14)) {
        return `${minutesDiff} минуты назад`;
      }
      return `${minutesDiff} минут назад`;
    } else if (hoursDiff < 24) {
      if (hoursDiff % 10 === 1) {
        return `${hoursDiff} час назад`;
      } else if ([2, 3, 4].includes(hoursDiff % 10) && !(hoursDiff % 100 >= 12 && hoursDiff % 100 <= 14)) {
        return `${hoursDiff} часа назад`;
      }
      return `${hoursDiff} часов назад`;
    } else if (daysDiff === 1) {
      return 'Вчера';
    } else if (daysDiff < 30) {
      if (daysDiff % 10 === 1 && daysDiff % 100 !== 11) {
        return `${daysDiff} день назад`;
      } else if ([2, 3, 4].includes(daysDiff % 10) && !(daysDiff % 100 >= 12 && daysDiff % 100 <= 14)) {
        return `${daysDiff} дня назад`;
      } else {
        return `${daysDiff} дней назад`;
      }
    } else {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', timeZone: 'Europe/Moscow' };
      const monthDay = localDateTime.toLocaleDateString('ru-RU', options);

      if (year !== currentYear) {
        return `${monthDay} ${year}`;
      } else {
        return monthDay;
      }
    }
  }
}
