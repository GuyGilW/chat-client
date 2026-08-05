import {api} from './client';
export async function signup(email: string, username: string, password: string) {
  const res = await api.post('/auth/signup', { email, username, password });
  return res.data;
}

export async function login(username: string, password: string) {
    const res = await api.post('/auth/login', {username, password})
    return res.data;
}


export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}