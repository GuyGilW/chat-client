import {api} from './client'; 

export async function makeChat(creatorId: number, name: string | undefined, isGroup: boolean, memberIds: number[]) {
  const res = await api.post('/chats/make', { creatorId, name, isGroup, memberIds});
  return res.data;
}

export async function findChats(chatId: number, requesterId: number, newUserId: number)
{
    const res = await api.post('/chats/findallUser', {chatId, requesterId, newUserId});
    return res.data;
}

export async function getChats() {
  const res = await api.get('/chats/get');
  return res.data;
}

export async function getChat(chatId: number) {
  const res = await api.get(`/chats/${chatId}`);
  return res.data;
}

export async function leaveChat(chatId: number, userId: number) {
  const res = await api.post(`/chats/${chatId}/leave`, {userId});
  return res.data;
}

export async function removeMember(chatId: number, requesterId: number,
    targetUserId: number, ) {
  const res = await api.post(`/chats/${chatId}/leave`, {requesterId, targetUserId});
  return res.data;
}

export async function deleteChat(chatId: number, userId: number)
{
    const res = await api.post(`/chats/${chatId}`, {userId})
    return res.data;
}




