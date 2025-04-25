export function getDateLabel(inputDate: string | Date) {
  let date: Date;

  if (typeof inputDate === 'string') {
    inputDate = inputDate.replace(' ', 'T');
    date = new Date(inputDate);
  } else {
    date = inputDate;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  const dayBeforeYesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  const dayOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  const isCurrentYear = date.getFullYear() === today.getFullYear();

  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  } else if (date.toDateString() === dayBeforeYesterday.toDateString()) {
    return 'Позавчера';
  } else if (date >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
    return `${dayOfWeek[date.getDay()]}`;
  } else {
    return isCurrentYear ?
      date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) :
      date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
