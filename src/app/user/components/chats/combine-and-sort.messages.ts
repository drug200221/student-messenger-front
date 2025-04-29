import {ContactOrChat, User} from './user-chats-and-contacts';

export type CombinedContactsAndChats = (ContactOrChat) & {
  type: 'contact' | 'chat'
};

export function combineAndSortMessages(user: User): CombinedContactsAndChats[] {
  const contact = user.contacts.map(contact => ({
    ...contact,
    type: 'contact' as const,
  }));

  const chat = user.chats.map(chat => ({
    ...chat,
    type: 'chat' as const,
  }));

  const combinedMessages: CombinedContactsAndChats[] = [...contact, ...chat];

  combinedMessages.sort((a, b) => {
    const dateA = new Date(a.lastMessage.date.date).getTime();
    const dateB = new Date(b.lastMessage.date.date).getTime();
    return dateA - dateB;
  });

  return combinedMessages;
}
