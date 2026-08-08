import { api } from './client';


export async function createMessage(chatId: string, content: string) {
    const res = await api.post('/message/create', {chatId, content });
    return res.data;
}

export async function findAllInChat(chatId: number) {
    const res = await api.post('/message/create', { chatId});
    return res.data;
}

export async function deleteMessage(messageId: number) {
    const res = await api.post('/message/create', { messageId});
    return res.data;
}


