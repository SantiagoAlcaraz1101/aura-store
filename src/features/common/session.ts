import { SESSION_COOKIE } from './config';
export function readToken(): string | null {
  if (typeof document === 'undefined') return null;
  const value = document.cookie.split('; ').find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  return value ? decodeURIComponent(value) : null;
}
export function saveToken(token: string) {
  // Se usa una cookie legible por JS porque el cliente envía Authorization a Express.
  // La firma se comprueba en proxy.ts y en el backend; leer exp aquí solo fija su duración.
  const payload: unknown = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  if (typeof payload !== 'object' || payload === null || !('exp' in payload) || typeof payload.exp !== 'number') throw new Error('Respuesta de sesión inválida.');
  const maxAge = Math.max(0, Math.floor(payload.exp - Date.now() / 1000));
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}
export function clearToken() {
  if (typeof document !== 'undefined') document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}
