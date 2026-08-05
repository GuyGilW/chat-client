import { api } from './client';


export async function createMessage(senderId: number, chatId: string, content: string) {
    const res = await api.post('/message/create', { senderId, chatId, content });
    return res.data;
}

export async function findAllInChat(chatId: number, userId: number) {
    const res = await api.post('/message/create', { chatId, userId });
    return res.data;
}

export async function deleteMessage(messageId: number, userId: number) {
    const res = await api.post('/message/create', { messageId, userId });
    return res.data;
}


