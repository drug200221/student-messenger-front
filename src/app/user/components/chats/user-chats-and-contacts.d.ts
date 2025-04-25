interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface ContactMessage {
  chatId: null;
  senderId: number;
  messageId: number;
  replyMessageId: number | null;
  text: string;
  status: number;
  date: DateTime;
  deletedBySender: boolean;
  deletedByRecipient: boolean;
  isEdited: boolean;
  fileId: number | null;
}

interface Contact {
  id: number;
  fullName: string;
  color: string;
  isArchived: boolean;
  notify: boolean;
  lastMessage: ContactMessage;
}

interface ChatMessage {
  senderId: null;
  chatId: number;
  messageId: number;
  replyMessageId: number | null;
  text: string;
  status: number;
  date: DateTime;
  deletedBySender: boolean;
  deletedByRecipient: boolean;
  isEdited: boolean;
  fileId: number | null;
}

interface Chat {
  id: number;
  title: string;
  description: string | null;
  color: string;
  isArchived: boolean;
  notify: boolean;
  lastMessage: ChatMessage;
}

interface User {
  id: number;
  fullName: string;
  color: string;
  contacts: Contact[];
  chats: Chat[];
}

export { User, Contact, ContactMessage, Chat, ChatMessage, Message, DateTime };
