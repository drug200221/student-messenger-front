export interface Sender {
  id: number;
  name: string;
}

export interface LastMessage {
  id: number;
  text: string;
  dateTime: Date;
  sender: Sender;
}

export interface Chat {
  id: number;
  title: string;
  type: 'chat' | 'direct';
  lastMessage: LastMessage;
}
