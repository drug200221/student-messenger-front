interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface ContactOrChatMessage {
  chatId?: number; // для чата
  recipientId?: number; // для контакта
  messageId: number;
  replyMessageId: number | null;
  text: string;
  status: number;
  date: DateTime;
  deletedBySender: boolean;
  deletedByRecipient: boolean;
  fileId: number | null;
  isEdited: boolean;
}

interface ContactOrChat {
  id: number;
  fullName?: string; // для контакта
  title?: string; // для чата
  description?: string | null; // для чата
  color: string;
  isArchived: boolean;
  notify: boolean;
  lastMessage: ContactOrChatMessage;
}

interface User {
  id: number;
  fullName: string;
  color: string;
  contacts: ContactOrChat[];
  chats: ContactOrChat[];
}

export { User, ContactOrChat, ContactOrChatMessage, DateTime };
