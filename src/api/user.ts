import { api } from './client';

export async function findById(id: number) {
    const res = await api.get(`/users/${id}`);
    return res.data;
}

export async function updateUsername(newUsername: string)
{
    const res = await api.patch('/users/updateUsername', {newUsername}
    ); 
    return res.data;
}

export async function updateEmail(email: string)
{
    const res = await api.patch('/users/updateEmail', {email}
    ); 
    return res.data;
}

export async function updatePassword(currentPassword: string, newPassword: string)
{
    const res = await api.patch('/users/updatePassword', {currentPassword, newPassword}
    ); 
    return res.data;
}