interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  messageId: number;
  replyMessageId: number | null;
  text: string;
  status: number;
  date: DateTime;
  fileId: number | null;
}

interface ContactInfo {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  fullName: string;
}

interface Contact {
  id: number;
  contact: ContactInfo;
  isArchived: boolean;
  notify: boolean;
  lastMessage: Message;
}

interface Chat {
  userId: number;
  chatId: number;
  title: string;
  description: string;
  color: string;
  isArchived: boolean;
  notify: boolean;
  lastMessage: Message;
}

interface User {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  fullName: string;
  contacts: Contact[];
  chats: Chat[];
}

export { User, Contact, Chat, Message, DateTime };
