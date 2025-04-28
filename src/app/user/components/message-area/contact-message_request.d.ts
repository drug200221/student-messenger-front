export interface IContactMessageRequest {
  id?: number,
  senderId: number,
  text: string,
  replyMessageId?: number,
  fileId?: number,
  status?: number,
  isEdited?: boolean,
  deletedBySender?: boolean,
  deletedByRecipient?: boolean,
}
