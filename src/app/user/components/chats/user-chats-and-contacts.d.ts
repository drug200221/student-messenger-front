interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface IContactOrChatMessage {
  chatId?: number; // для чата
  recipientId?: number; // для контакта
  sender: {
    id: number;
    fullName: string;
    shortName: string;
    color: string;
  };
  messageId: number;
  replyMessageId: number | null;
  text: string;
  date: DateTime;
  deletedBySender: boolean;
  deletedByRecipient: boolean;
  fileId: number | null;
  isEdited: boolean;
}

interface IContactOrChat {
  id: number;
  fullName?: string; // для контакта
  title?: string; // для чата
  description?: string | null; // для чата
  color: string;
  lastReadMessageUserId: number;
  lastReadMessageContactId: number;
  isArchived: boolean;
  notify: boolean;
  messages: IContactOrChatMessage[];
  newMessages: number;
}

interface IUser {
  id: number;
  fullName: string;
  color: string;
  contacts: IContactOrChat[];
  chats: IContactOrChat[];
}

export { IUser, IContactOrChat, IContactOrChatMessage, DateTime };
