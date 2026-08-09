import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getMe } from '../api/auth';
import { AuthContext} from './AuthContext';
import type {User} from './AuthContext'
import { connectSocket } from '../api/socket';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem('access_token'));

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return; 

    getMe()
      .then((user) => 
      {
        setUser(user);
        connectSocket(token);
      })
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}