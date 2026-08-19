import { Box, Avatar, Typography, ListItem } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import type { Message } from '../types/types';
import  { MessageStatusType} from '../types/types';
import { avatarUrl } from '../api/user';

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getOverallStatus(statuses: Message['statuses']): MessageStatusType | null {
  if (statuses.length === 0) return null;
  if (statuses.every((s) => s.status === MessageStatusType.Seen)) return MessageStatusType.Seen;
  if (statuses.some((s) => s.status === MessageStatusType.Delivered || s.status === MessageStatusType.Seen)) {
    return MessageStatusType.Delivered;
  }
  return MessageStatusType.Sent;
}

export default function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const overallStatus = isOwn ? getOverallStatus(message.statuses) : null;
  const avatarSrc = avatarUrl(message.sender.avatarUrl ?? null);

  return (
    <ListItem sx={{ justifyContent: isOwn ? 'flex-end' : 'flex-start', gap: 1 }}>
      {!isOwn && (
        <Avatar src={avatarSrc} sx={{ width: 32, height: 32 }}>
          {!avatarSrc && message.sender.username[0]?.toUpperCase()}
        </Avatar>
      )}
      <Box
        sx={{
          bgcolor: isOwn ? 'primary.main' : 'grey.200',
          color: isOwn ? 'white' : 'black',
          borderRadius: 2,
          px: 2,
          py: 1,
          maxWidth: '70%',
        }}
      >
        {!isOwn && (
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
            {message.sender.username}
          </Typography>
        )}
        
        <Typography variant="body1">{message.content}</Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {formatTime(message.createdAt)}
          </Typography>
          
          {isOwn && overallStatus === MessageStatusType.Sent && (
            <DoneIcon sx={{ fontSize: 14, opacity: 0.8 }} />
          )}
          {isOwn && overallStatus === MessageStatusType.Delivered && (
            <DoneAllIcon sx={{ fontSize: 14, opacity: 0.8 }} />
          )}
          {isOwn && overallStatus === MessageStatusType.Seen && (
            <DoneAllIcon sx={{ fontSize: 14, color: '#90caf9' }} />
          )}
        </Box>
      </Box>
    </ListItem>
  );
}