const host = process.env.NEXT_PUBLIC_API_HOST;
export const API_BASE_URL = host?.replace(/\/$/, '') ?? '';
export const SESSION_COOKIE = 'aura_session';
