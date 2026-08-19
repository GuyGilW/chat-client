import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, List, Paper, Avatar } from '@mui/material';
import { findAllInChat } from '../api/message';
import { getSocket, sendMessage as socketSendMessage, joinChat, markSeen } from '../api/socket';
import { useAuth } from '../context/AuthContext';
import { getChat, updateGroupImage } from '../api/chats';
import { getChatDisplayInfo } from '../util/chatDisplay.ts';
import type { Chat, Message } from '../types/types.ts'
import GroupControls from '../components/GroupControls.tsx';
import MessageBubble from '../components/MessageBubble';

export default function ChatWindow() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [content, setContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!chatId) return;

    getChat(Number(chatId)).then(setChat);
    findAllInChat(Number(chatId)).then((msgs: Message[]) => {
      setMessages(msgs);
      msgs.forEach((msg) => {
        if (msg.senderId !== user?.id) {
          const myStatus = msg.statuses.find((s) => s.userId === user?.id);
          if (myStatus && myStatus.status !== 'SEEN') {
            markSeen(msg.id, Number(chatId));
          }
        }
      });
    });
    joinChat(Number(chatId));

    const socket = getSocket();

    if (!socket) return;

    const handleNewMessage = (msg: Message) => {
      if (msg.chatId === Number(chatId)) {
        setMessages((prev) => [...prev, msg]);
        if (msg.senderId !== user?.id) {
          markSeen(msg.id, Number(chatId));
        }
      }
    };


    const handleStatusUpdate = (status: { messageId: number; userId: number; status: 'SENT' | 'DELIVERED' | 'SEEN' }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== status.messageId) return msg;
          const otherStatuses = msg.statuses.filter((s) => s.userId !== status.userId);
          return {
            ...msg,
            statuses: [...otherStatuses, { id: 0, messageId: status.messageId, userId: status.userId, status: status.status }],
          };
        }),
      );
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('statusUpdate', handleStatusUpdate);
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('statusUpdate', handleStatusUpdate)
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

  const headerInfo = chat
    ? getChatDisplayInfo(chat, user?.id)
    : { title: `Chat #${chatId}`, subtitle: '', src: undefined };

  const { title: headerTitle, src: headerAvatarSrc } = headerInfo

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
        {chat?.isGroup && (
          <GroupControls
            chatId={Number(chatId)}
            onLeave={() => navigate('/chats')}
            onMemberAdded={() => getChat(Number(chatId)).then(setChat)}
          />
        )}
      </Box>

      <Paper sx={{ flex: 1, overflowY: 'auto', p: 2, mb: 2 }}>
        <List>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />
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