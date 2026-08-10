import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemText, Avatar, Box, Typography, Button, CircularProgress } from '@mui/material';
import { getChats } from '../api/chats';
import { useAuth } from '../context/AuthContext';
import { avatarUrl } from '../api/user';

interface UserProfile {
  id: number;
  username: string;
  avatarUrl?: string | null;
}

interface ChatMember {
  id: number;
  userId: number;
  user?: UserProfile;
}

interface Chat {
  id: number;
  name: string | null;
  isGroup: boolean;
  imageUrl?: string;
  members: ChatMember[];
}


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


  const getChatDetails = (chat: Chat) => {
    if (chat.isGroup) {
      return {
        title: chat.name || `Group Chat #${chat.id}`,
        subtitle: `${chat.members.length} members`,
        avatarUrl: avatarUrl(chat.imageUrl ?? null),
      };
    }
    const otherMember = chat.members.find((m) => m.userId !== user?.id);

    if (!otherMember) {
      const selfMember = chat.members.find((m) => m.userId === user?.id);
      const selfUsername = selfMember?.user?.username || user?.username || 'You';
      return {
        title: `${selfUsername} (You)`,
        avatarUrl: avatarUrl(selfMember?.user?.avatarUrl ?? null) ,
      };
    }
    return {
      title: otherMember.user?.username || 'Direct Message',
      subtitle: 'Direct Message',
      avatarUrl: avatarUrl(otherMember.user?.avatarUrl ?? null),
    };
  };

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
          const { title, subtitle, avatarUrl } = getChatDetails(chat);

          return (
            <ListItemButton key={chat.id} onClick={() => navigate(`/chats/${chat.id}`)}>
              <Avatar src={avatarUrl || undefined} sx={{ mr: 2 }}>
                {!avatarUrl && title[0]?.toUpperCase()}
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