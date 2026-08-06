import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {useAuth } from './context/AuthContext';
import {AuthProvider} from './context/AuthProvider'
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {theme} from './theme/theme'
import ChatList from './pages/ChatList';


function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/chats" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/chats" /> : <Signup />} />
      <Route path="/chats" element={user ? <ChatList /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? '/chats' : '/login'} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
    </CssBaseline>
    </ThemeProvider>
  );
}