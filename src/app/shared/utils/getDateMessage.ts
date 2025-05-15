import { DateTime } from '../../user/components/chats/user-chats-and-contacts';

/**
 * Функция для форматирования даты сообщения
 * @param dateTime
 */
export function getDateMessage(dateTime: DateTime): string {
  const localDateTime = new Date(dateTime.date + `GMT+${dateTime.timezone_type}`);
  const now = new Date();
  const timeDiff = now.getTime() - localDateTime.getTime();
  const hoursDiff = Math.floor(timeDiff / (1000 * 3600));

  const currentYear = now.getFullYear();
  const year = localDateTime.getFullYear();

  if (hoursDiff < 24) {
    const localHours = localDateTime.getHours();
    const localMinutes = localDateTime.getMinutes();

    const formattedHours = localHours < 10 ? '0' + localHours : localHours;
    const formattedMinutes = localMinutes < 10 ? '0' + localMinutes : localMinutes;

    return `${formattedHours}:${formattedMinutes}`;
  }
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', timeZone: 'Europe/Moscow' };
  const monthDay = localDateTime.toLocaleDateString('ru-RU', options);

  if (year !== currentYear) {
    return `${monthDay} ${year}`;
  } else {
    return monthDay;
  }
}
