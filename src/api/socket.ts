import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token: string) {
  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
  });
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error('Socket not connected yet');
  return socket;
}

export function markDelivered(messageId: number, chatId: number) {
  getSocket().emit('messageDelivered', { messageId, chatId });
}

export function markSeen(messageId: number, chatId: number) {
  getSocket().emit('messageSeen', { messageId, chatId });
}

export function sendMessage(chatId: number, content: string) {
  getSocket().emit('sendMessage', { chatId, content });
}

export function joinChat(chatId: number) {
  getSocket().emit('joinChat', chatId);
}