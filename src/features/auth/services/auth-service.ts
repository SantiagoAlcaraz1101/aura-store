import { http } from '../../common/http';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../domain/types';
export const login = (input: LoginRequest) => http<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) });
export const register = (input: RegisterRequest) => http<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) });
export const currentUser = () => http<{ user: User }>('/api/auth/me');
