export interface User { id: string; name: string; email: string; role: 'admin' | 'user' }
export interface LoginRequest { email: string; password: string }
export interface RegisterRequest extends LoginRequest { name: string }
export interface AuthResponse { user: User; token: string }
