import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { leaveChat, addMember } from '../api/chats';
import { findByUsername } from '../api/user';

interface GroupControlsProps {
    chatId: number;
    onLeave: () => void;
    onMemberAdded: () => void;
}

export default function GroupControls({ chatId, onLeave, onMemberAdded }: GroupControlsProps) {
    const [addUsername, setAddUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLeave = async () => {
        await leaveChat(chatId);
        onLeave();
    };


    const handleAddMember = async () => {
        if (!addUsername.trim()) return;
        setError('');
        setSuccess('');
        try {
            const targetUser = await findByUsername(addUsername.trim());
            await addMember(chatId, targetUser.id);
            setSuccess(`${targetUser.username} added to the chat`);
            setAddUsername('');
            onMemberAdded();
        } catch {
            setError('User not found');
        }
    }


        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        size="small"
                        placeholder="Username to add"
                        value={addUsername}
                        onChange={(e) => setAddUsername(e.target.value)}
                    />
                    <Button variant="outlined" onClick={handleAddMember}>Add Member</Button>
                </Box>
                {error && <Typography color="error" variant="caption">{error}</Typography>}
                {success && <Typography color="success.main" variant="caption">{success}</Typography>}
                <Button variant="outlined" color="error" onClick={handleLeave}>
                    Leave Chat
                </Button>
            </Box>
        );
     }