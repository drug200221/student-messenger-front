export interface IMessageRequest {
  id?: number,
  chatId: number;
  text: string,
  isEdited: boolean
  replyMessageId: number | null,
  fileId: number | null,
  recipientId: number | null,
  action?: 'edit';
}

export interface IReadMessageRequest {
  action: 'read';
  lastReadMessageId: number;
}
