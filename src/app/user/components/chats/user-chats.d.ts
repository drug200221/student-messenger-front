interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface IMessage {
  id: number;
  chatId: number;
  sender: {
    id: number;
    fullName: string;
    shortName: string;
    color: string;
  };
  text: string;
  date: DateTime;
  isEdited: boolean;
  fileId: number | null;
  replyMessageId: number | null;
}

interface IChat {
  id: number;
  userId: number;
  title: string | null;
  description: string | null; // для чата
  color: string;
  isPrivate: boolean;
  isArchived: boolean;
  isNotify: boolean;
  lastMessageId: number;
  lastReadMessageId: number;
  participants: IParticipant[];
  messages: IMessage[];
  newMessagesCount: number;
  isShowLoadMoreBtn: boolean;
}

interface IParticipant {
  id: number;
  chatId: number;
  fullName: string;
  lastReadMessageId: number;
}

interface IUser {
  id: number;
  fullName: string;
  color: string;
  chats: IChat[];
}

export { IUser, IParticipant, IChat, IMessage, DateTime };
