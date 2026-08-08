import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { makeChat } from '../api/chats';
import { useAuth } from '../context/AuthContext';

export default function NewChat() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [usernamesInput, setUsernamesIput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!user) {
      setError('You must be logged in to create a chat.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const usernames = usernamesInput
        .split(',')
        .map((username) => username.trim())
        .filter(Boolean);

      const name = isGroup ? groupName.trim() : undefined;

      if (!isGroup &&  usernames.length === 0) {
        setError('Please enter a valid Username');
        setLoading(false);
        return;
      }

      if (isGroup && !name) {
        setError('Please enter a group name');
        setLoading(false);
        return;
      }

      const chat = await makeChat(name, isGroup, usernames);
      navigate(`/chats/${chat.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to create chat');
      } else {
        setError('Failed to create chat');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        mx: 'auto',
        mt: 6,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Start a New Chat
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControlLabel
        control={
          <Switch
            checked={isGroup}
            onChange={(e) => {
              setIsGroup(e.target.checked);
              setError('');
            }}
          />
        }
        label="Group Chat"
        sx={{ mb: 2 }}
      />

      {isGroup ? (
        <>
          <TextField
            label="Group Name"
            fullWidth
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            label="Usernames (comma-separated)"
            placeholder="e.g. 2, 5, 8"
            fullWidth
            margin="normal"
            value={usernamesInput}
            onChange={(e) => setUsernamesIput(e.target.value)}
          />
        </>
      ) : (
        <TextField
          label="Enter username of user"
          type="string"
          fullWidth
          margin="normal"
          value={usernamesInput}
          onChange={(e) => setUsernamesIput(e.target.value)}
        />
      )}

      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 2 }}
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : isGroup ? (
          'Create Group'
        ) : (
          'Start Chat'
        )}
      </Button>

      <Button
        variant="text"
        color="inherit"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate('/chats')}
        disabled={loading}
      >
        Cancel
      </Button>
    </Box>
  );
}