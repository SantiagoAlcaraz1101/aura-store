'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { clearToken, readToken, saveToken } from '../../common/session';
import { errorMessage } from '../../common/http';
import * as service from '../services/auth-service';
import type { User, LoginRequest, RegisterRequest } from '../domain/types';
interface AuthContextValue { user: User | null; loading: boolean; sessionError: string; login: (input: LoginRequest) => Promise<void>; register: (input: RegisterRequest) => Promise<void>; logout: () => void; refresh: () => Promise<void> }
const Context = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true); const [sessionError, setSessionError] = useState('');
  const router = useRouter();
  const refresh = useCallback(async () => {
    setSessionError('');
    if (!readToken()) { setUser(null); setLoading(false); return; }
    try { const result = await service.currentUser(); setUser(result.user); }
    catch (error) { setUser(null); setSessionError(errorMessage(error)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); const expired = () => { setUser(null); setLoading(false); }; window.addEventListener('aura:unauthorized', expired); return () => window.removeEventListener('aura:unauthorized', expired); }, [refresh]);
  async function login(input: LoginRequest) { const response = await service.login(input); saveToken(response.token); setUser(response.user); setSessionError(''); router.replace('/'); router.refresh(); }
  async function register(input: RegisterRequest) { const response = await service.register(input); saveToken(response.token); setUser(response.user); setSessionError(''); router.replace('/'); router.refresh(); }
  function logout() { clearToken(); setUser(null); setSessionError(''); router.replace('/login'); router.refresh(); }
  return <Context.Provider value={{ user, loading, sessionError, login, register, logout, refresh }}>{children}</Context.Provider>;
}
export function useAuth() { const context = useContext(Context); if (!context) throw new Error('useAuth necesita AuthProvider'); return context; }
