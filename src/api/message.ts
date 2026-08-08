import { api } from './client';


export async function createMessage(chatId: string, content: string) {
    const res = await api.post('/messages/make', {chatId, content });
    return res.data;
}

export async function findAllInChat(chatId: number) {
    const res = await api.get(`/messages/chat/${chatId}`);
    return res.data;
}

export async function deleteMessage(messageId: number) {
    const res = await api.post(`/messages/${messageId}/delete`);
    return res.data;
}


