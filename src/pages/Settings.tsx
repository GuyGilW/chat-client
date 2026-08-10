import { useState } from 'react';
import { Box, Avatar, Button, Typography, TextField, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { updateAvatar, updateUsername, updatePassword } from '../api/user';
import { getErrorMessage } from '../api/client';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const updated = await updateAvatar(formData);
      setUser(updated);
      setSuccess('Avatar updated!');
    } catch (err) {
      setError(getErrorMessage(err, 'Update failed'));
    }
  };

  const handleUsernameUpdate = async () => {
    setError('');
    setSuccess('');
    try {
      const updated = await updateUsername(username);
      setUser(updated);
      setSuccess('Username updated!');
    } catch (err) {
      setError(getErrorMessage(err, 'Update failed'));
    }
  };

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');
    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess('Password changed!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(getErrorMessage(err, 'Update failed'));
    }
  };

  const avatarSrc = user?.avatarUrl
    ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}`
    : undefined;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Profile</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar src={avatarSrc} sx={{ width: 80, height: 80, mb: 1 }} />
        <Button component="label" size="small">
          Change Avatar
          <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </Button>
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 2 }}>Username</Typography>
      <TextField fullWidth value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 1 }} />
      <Button variant="contained" onClick={handleUsernameUpdate}>Update Username</Button>

      <Typography variant="subtitle1" sx={{ mt: 3 }}>Change Password</Typography>
      <TextField
        fullWidth
        type="password"
        label="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        sx={{ mb: 1, mt: 1 }}
        autoComplete='current-password'
      />
      <TextField
        fullWidth
        type="password"
        label="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mb: 1 }}
        autoComplete='new-password'
      />
      <Button variant="contained" onClick={handlePasswordChange}>Change Password</Button>
    </Box>
  );
}