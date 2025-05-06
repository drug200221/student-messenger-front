import { DateTime } from '../../user/components/chats/user-chats-and-contacts';

/**
 * Функция для форматирования даты сообщения
 * @param dateTime
 */
export function getDateMessage(dateTime: DateTime): string {
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
  } else if (hoursDiff < 24) {
    const localHours = localDateTime.getHours();
    const localMinutes = localDateTime.getMinutes();

    const formattedHours = localHours < 10 ? '0' + localHours : localHours;
    const formattedMinutes = localMinutes < 10 ? '0' + localMinutes : localMinutes;

    return `${formattedHours}:${formattedMinutes}`;
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
