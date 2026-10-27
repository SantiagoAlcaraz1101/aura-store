import { API_BASE_URL } from './config';
import { clearToken, readToken } from './session';
export class ApiError extends Error {
  constructor(public status: number, message: string, public fields: Record<string, string> = {}) { super(message); }
}
export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) throw new ApiError(0, 'Falta configurar NEXT_PUBLIC_API_HOST.');
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  const token = readToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response: Response;
  try { response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, cache: 'no-store' }); }
  catch (error) { if (error instanceof DOMException && error.name === 'AbortError') throw error; throw new ApiError(0, 'No pudimos conectar con la tienda. Revisa tu conexión e inténtalo de nuevo.'); }
  if (response.status === 204) return undefined as T;
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const data = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {};
    const fields: Record<string, string> = {};
    if (typeof data.fields === 'object' && data.fields !== null) for (const [key, value] of Object.entries(data.fields)) if (typeof value === 'string') fields[key] = value;
    if (response.status === 401 && typeof window !== 'undefined') {
      clearToken(); window.dispatchEvent(new Event('aura:unauthorized'));
      // En login se conserva el error genérico junto al campo sin recargar el formulario.
      if (window.location.pathname !== '/login') window.location.replace('/login');
    }
    throw new ApiError(response.status, typeof data.message === 'string' ? data.message : 'No se pudo completar la solicitud.', fields);
  }
  return body as T;
}
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'No se pudo completar la solicitud.';
