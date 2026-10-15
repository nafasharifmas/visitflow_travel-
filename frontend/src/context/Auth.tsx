import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, getToken, setToken } from '../api/client';
import type { AuthPayload, User } from '../api/types';

interface Registration { username: string; name: string; email: string; password: string; password_confirmation: string }
interface AuthState {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<User>;
  register: (f: Registration) => Promise<User>;
  logout: () => Promise<void>;
}
const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api.get<User>('/user').then((r) => setUser(r.data)).catch(() => setToken(null)).finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(() => {
    const accept = (r: { data: AuthPayload }) => { setToken(r.data.token); setUser(r.data.user); return r.data.user; };
    return {
      user, loading,
      login: async (login, password) => accept(await api.post<AuthPayload>('/login', { login, password })),
      register: async (f) => accept(await api.post<AuthPayload>('/register', f)),
      logout: async () => { try { await api.post('/logout'); } finally { setToken(null); setUser(null); } },
    };
  }, [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
