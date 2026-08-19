import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket) {
    socket.disconnect();
  }
  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem('access_token');
    if (token) {
      return connectSocket(token);
    }
    return null; 
  }
  return socket;
}

export function markDelivered(messageId: number, chatId: number) {
  getSocket()?.emit('messageDelivered', { messageId, chatId });
}

export function markSeen(messageId: number, chatId: number) {
  getSocket()?.emit('messageSeen', { messageId, chatId });
}

export function sendMessage(chatId: number, content: string) {
  getSocket()?.emit('sendMessage', { chatId, content });
}

export function joinChat(chatId: number) {
  getSocket()?.emit('joinChat', chatId);
}