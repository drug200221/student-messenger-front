import { IContactOrChatMessage } from '../../user/components/chats/user-chats-and-contacts';

export function shouldDisplayDate($index: number, messages: IContactOrChatMessage[]) {
  if ($index === 0) {
    return true;
  }

  const currentDate = new Date(messages[$index].date.date).setHours(0, 0, 0, 0);
  const prevDate = new Date(messages[$index - 1].date.date).setHours(0, 0, 0, 0);
  return currentDate > prevDate;
}
