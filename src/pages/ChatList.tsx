import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemText, Avatar, Box, Typography, Button, CircularProgress } from '@mui/material';
import { getChats } from '../api/chats';
import { useAuth } from '../context/AuthContext';
import {getChatDisplayInfo} from '../util/chatDisplay';
import type {Chat} from '../types/types';

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    getChats()
      .then(setChats)
      .finally(() => setLoading(false));
  }, []);



  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" onClick={() => navigate('/settings')}>Settings</Button>
        <Typography variant="h5">Your Chats</Typography>
        <Button variant="contained" onClick={() => navigate('/chats/new')}>
          New Chat
        </Button>
      </Box>

      <List>
        {chats.map((chat) => {
          const { title, subtitle, src } = getChatDisplayInfo(chat, user?.id );

          return (
            <ListItemButton key={chat.id} onClick={() => navigate(`/chats/${chat.id}`)}>
              <Avatar src={src || undefined} sx={{ mr: 2 }}>
                {!src && title[0]?.toUpperCase()}
              </Avatar>
              <ListItemText primary={title} secondary={subtitle} />
            </ListItemButton>
          );
        })}

        {chats.length === 0 && (
          <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            No chats yet — start one!
          </Typography>
        )}
      </List>
    </Box>
  );
}