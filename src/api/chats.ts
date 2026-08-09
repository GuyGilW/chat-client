import {api} from './client'; 

export async function makeChat( name: string | undefined, isGroup: boolean, usernames: string[]) {
  const res = await api.post('/chats/make', { name, isGroup, usernames});
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

export async function leaveChat(chatId: number ){
  const res = await api.post(`/chats/${chatId}/leave`);
  return res.data;
}

export async function removeMember(chatId: number, 
    targetUserId: number, ) {
  const res = await api.post(`/chats/${chatId}/leave`, { targetUserId});
  return res.data;
}

export async function deleteChat(chatId: number, userId: number)
{
    const res = await api.post(`/chats/${chatId}`, {userId})
    return res.data;
}




