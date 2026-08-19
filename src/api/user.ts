import { api } from './client';

export async function findById(id: number) {
    const res = await api.get(`/users/${id}`);
    return res.data;
}

export async function findByUsername(username: string)
{
    const res = await api.get(`/users/by-username/${username}`); 
    return res.data;
}

export async function updateUsername(username: string)
{
    const res = await api.patch('/users/update/username', {username}
    ); 
    return res.data;
}

export async function updateEmail(email: string)
{
    const res = await api.patch('/users/update/email', {email}
    ); 
    return res.data;
}

export async function updatePassword(currentPassword: string, newPassword: string)
{
    const res = await api.patch('/users/update/password', {currentPassword, newPassword}
    ); 
    return res.data;
}

export async function updateAvatar(formData: FormData)
{
    const res = await api.patch('/users/update/avatar', formData, {headers: { 'Content-Type': 'multipart/form-data' },
  }); 
    return res.data; 
}

export function  avatarUrl (path: string | null) {

  return path ? `${import.meta.env.VITE_API_URL}${path}` : undefined;

}