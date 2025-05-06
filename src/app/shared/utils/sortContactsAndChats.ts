import { CombinedContactsAndChats } from '../../user/components/chats/combine-and-sort.messages';

/**
 * Функция для сортировки чатов и контактов по времени (самые новые сверху)
 * @param items
 */
export function sortContactsAndChats(items: CombinedContactsAndChats[]) {
  return items.sort((a, b) => {

    const dateA = a.messages && a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].date.date).getTime() : 0;
    const dateB = b.messages && b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].date.date).getTime() : 0;

    return dateB - dateA;
  });
}
