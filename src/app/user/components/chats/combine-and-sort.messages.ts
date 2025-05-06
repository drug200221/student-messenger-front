import { IContactOrChat, IUser } from './user-chats-and-contacts';
import { sortContactsAndChats } from '../../../shared/utils/sortContactsAndChats';

export type CombinedContactsAndChats = (IContactOrChat) & {
  type: 'contact' | 'chat'
};

export function combineAndSortMessages(user: IUser): CombinedContactsAndChats[] {
  const combinedMessage: CombinedContactsAndChats[] = [
    ...user.contacts.map(contact => ({
      ...contact,
      type: 'contact' as const,
    })),
    ...user.chats.map(chat => ({
      ...chat,
      type: 'chat' as const,
    })),
  ];

  sortContactsAndChats(combinedMessage);

  return combinedMessage;
}
