import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, List, ListItem, Paper, Avatar } from '@mui/material';
import { findAllInChat } from '../api/message';
import { getSocket, sendMessage as socketSendMessage, joinChat, markSeen } from '../api/socket';
import { useAuth } from '../context/AuthContext';
import { avatarUrl } from '../api/user';

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
  const [content, setContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

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

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Chat #{chatId}</Typography>

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