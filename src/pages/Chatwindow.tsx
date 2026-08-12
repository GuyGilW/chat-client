import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, List, ListItem, Paper, Avatar } from '@mui/material';
import { findAllInChat } from '../api/message';
import { getSocket, sendMessage as socketSendMessage, joinChat, markSeen } from '../api/socket';
import { useAuth } from '../context/AuthContext';
import { avatarUrl } from '../api/user';
import { getChat, updateGroupImage } from '../api/chats';

interface ChatMember {
  userId: number;
  user: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
}

interface Chat {
  id: number;
  name: string | null;
  isGroup: boolean;
  imageUrl: string | null;
  members?: ChatMember[];
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  chatId: number;
  createdAt: string;
  sender: { id: number; username: string; avatarUrl: string | null };
}

export default function ChatWindow() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [content, setContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    getChat(Number(chatId)).then(setChat);
    findAllInChat(Number(chatId)).then(setMessages);
    joinChat(Number(chatId));

    const socket = getSocket();
    const handleNewMessage = (msg: Message) => {
      if (msg.chatId === Number(chatId)) {
        setMessages((prev) => [...prev, msg]);
        if (msg.senderId !== user?.id) {
          markSeen(msg.id, Number(chatId));
        }
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [chatId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!content.trim() || !chatId) return;
    socketSendMessage(Number(chatId), content);
    setContent('');
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;
    const formData = new FormData();
    formData.append('image', file);
    const updated = await updateGroupImage(Number(chatId), formData);
    setChat(updated);
  };

  const getHeaderInfo = () => {
    if (!chat) return { title: `Chat #${chatId}`, src: undefined };

    if (chat.isGroup) {
      return {
        title: chat.name || 'Group Chat',
        src: avatarUrl(chat.imageUrl),
      };
    }

    const members = chat.members || [];
    const otherMember = members.find((m) => m.user.id !== user?.id);
    const targetUser = otherMember?.user;

    if (!otherMember)
    {
      const selfUser = members.find((m) => m.user?.id)?.user || user;
      const username = selfUser?.username ? `${selfUser.username} (You)` : 'You';
      return {
        title: username,
        src: avatarUrl(selfUser?.avatarUrl ?? null) 
      }
    };

    return {
      title: targetUser?.username || `Chat #${chatId}`,
      src: avatarUrl(targetUser?.avatarUrl ?? null),
    };
  };

  const { title: headerTitle, src: headerAvatarSrc } = getHeaderInfo();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar src={headerAvatarSrc} sx={{ width: 44, height: 44 }}>
          {!headerAvatarSrc && headerTitle[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {headerTitle}
          </Typography>
          
          {chat?.isGroup && (
            <Button component="label" size="small" sx={{ p: 0, minWidth: 0, textTransform: 'none', fontSize: '0.75rem' }}>
              Change Group Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ flex: 1, overflowY: 'auto', p: 2, mb: 2 }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              {msg.senderId !== user?.id && (
                <Avatar 
                 src ={avatarUrl(msg.sender.avatarUrl)}
                 sx = {{width: 32, height: 32}}
                /> 
              )}
              <Box
                sx={{
                  bgcolor: msg.senderId === user?.id ? 'primary.main' : 'grey.200',
                  color: msg.senderId === user?.id ? 'white' : 'black',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: '70%',
                }}
              >
                {msg.senderId !== user?.id && (
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
                    {msg.sender.username}
                  </Typography>
                )}
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            </ListItem>
          ))}
          <div ref={bottomRef} />
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>
    </Box>
  );
} 