export interface IMessageRequest {
  id?: number,
  chatId?: number; // для чата
  recipientId?: number; // для контакта
  text: string,
  replyMessageId?: number,
  fileId?: number,
  status?: number,
  isEdited?: boolean,
  deletedBySender?: boolean,
  deletedByRecipient?: boolean,
}
