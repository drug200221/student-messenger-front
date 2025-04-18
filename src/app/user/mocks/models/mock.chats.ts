import { Chat } from '../interfaces/chat';

export const mockChats: Chat[] = [
  {
    id: 1,
    title: 'Иван Иванов Иванович',
    type: 'chat',
    lastMessage: {
      id: 1001,
      sender: {
        name: 'Иван Иванов',
        id: 3,
      },
      text: 'Когда мы идем в кино?',
      dateTime: {
        date: '2025-04-18 9:11:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 2,
    title: 'Алексей Алексеев Алексеевич',
    type: 'direct',
    lastMessage: {
      id: 1002,
      sender: {
        name: 'Алексей Алексеев',
        id: 4,
      },
      text: 'Не забудь о встрече завтра!',
      dateTime: {
        date: '2024-11-02 11:30:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 3,
    title: 'Мария Мариева',
    type: 'chat',
    lastMessage: {
      id: 1003,
      sender: {
        name: 'Мария Мариева',
        id: 5,
      },
      text: 'Давай встретимся в кафе?',
      dateTime: {
        date: '2023-10-01 09:45:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 4,
    title: 'Сергей Сергеевич',
    type: 'direct',
    lastMessage: {
      id: 1004,
      sender: {
        name: 'Сергей Сергеевич',
        id: 6,
      },
      text: 'Я проверил документы, все в порядке.',
      dateTime: {
        date: '2023-10-01 10:15:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 5,
    title: 'Елена Еленовна',
    type: 'chat',
    lastMessage: {
      id: 1005,
      sender: {
        name: 'Елена Еленовна',
        id: 7,
      },
      text: 'Как идет проект?',
      dateTime: {
        date: '2023-10-01 10:00:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 6,
    title: 'Анна Андреевна',
    type: 'direct',
    lastMessage: {
      id: 1006,
      sender: {
        name: 'Анна Андреевна',
        id: 8,
      },
      text: 'Ты закончил домашнее задание?',
      dateTime: {
        date: '2023-10-01 09:50:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 7,
    title: 'Дмитрий Дмитриевич',
    type: 'chat',
    lastMessage: {
      id: 1007,
      sender: {
        name: 'Дмитрий Дмитриевич',
        id: 9,
      },
      text: 'Когда сдать отчет?',
      dateTime: {
        date: '2023-10-01 11:00:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 8,
    title: 'Ольга Ольговна',
    type: 'direct',
    lastMessage: {
      id: 1008,
      sender: {
        name: 'Ольга Ольгова',
        id: 8,
      },
      text: 'Ты нашел информацию для проекта?',
      dateTime: {
        date: '2023-10-01 10:20:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
    },
  },
  {
    id: 9,
    title: 'Виктор Викторович',
    type: 'chat',
    lastMessage: {
      id: 1009,
      text: 'Не забудь про завтра!',
      dateTime: {
        date: '2023-10-01 10:50:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
      sender: {
        name: 'Светлана Светлановна',
        id: 11,
      },
    },
  },
  {
    id: 10,
    title: 'Светлана Светлановна',
    type: 'direct',
    lastMessage: {
      id: 1010,
      text: 'Когда мы идем на встречу?',
      dateTime: {
        date: '2023-10-01 09:30:00.000000',
        timezone_type: 3,
        timezone: 'Europe/Moscow',
      },
      sender: {
        name: 'Светлана Светлановна',
        id: 10,
      },
    },
  },
];
