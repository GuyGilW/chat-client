import { AppBar, Toolbar, Typography, Avatar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { avatarUrl } from '../api/user';

export default function NavBar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        navigate('/login');
    };

    if (!user) return null;

    return (
        <AppBar position="static" color="primary" elevation={1}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="h6"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/chats')}
                >
                    Chat App
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Button variant="contained"  onClick={() => navigate('/chats')}>Chats</Button>

                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/settings')} >
                        <Typography variant="caption">{user.username}</Typography>
                        <Avatar src={avatarUrl(user.avatarUrl)} sx={{ width: 32, height: 32 }} />
                    </Box>

                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}