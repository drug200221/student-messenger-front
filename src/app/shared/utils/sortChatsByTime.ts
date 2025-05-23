import { IChat } from '../../user/components/chats/user-chats';

/**
 * Функция для сортировки чатов и контактов по времени (самые новые сверху)
 * @param items
 */
export function sortChatsByTime(items: IChat[] | null) {
  if (items !== null) {
    return items.sort((a, b) => {

      const dateA = a.messages && a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].date.date).getTime() : 0;
      const dateB = b.messages && b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].date.date).getTime() : 0;

      return dateB - dateA;
    });
  }
  return [];
}
