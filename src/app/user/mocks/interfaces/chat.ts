export interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

export interface Sender {
  id: number;
  name: string;
}

export interface LastMessage {
  id: number;
  text: string;
  dateTime: DateTime,
  sender: Sender;
}

export interface Chat {
  id: number;
  title: string;
  type: 'chat' | 'direct';
  lastMessage: LastMessage;
}
